"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
const BEATS = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
const EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️' };
exports.default = new forgescript_1.NativeFunction({
    name: '$gameRpsChoice',
    description: 'Submits a rock/paper/scissors choice. Returns JSON with result once both players have chosen.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'sessionID',
            description: 'Session UUID returned by $gameCreate',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: 'choice',
            description: 'rock | paper | scissors',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: 'userID',
            description: 'Override user ID',
            type: forgescript_1.ArgType.User,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [sessionID, choice, user]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        if (session.type !== 'rps')
            return this.customError('This session is not an RPS game.');
        if (session.status !== 'active')
            return this.customError('The game is not active.');
        if (!session.data.challenger)
            return this.customError('RPS not initialised. Use $gameNewRps first.');
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.customError('Could not determine user.');
        const pick = choice.toLowerCase().trim();
        if (!['rock', 'paper', 'scissors'].includes(pick))
            return this.customError(`Invalid choice "${pick}". Use: rock, paper, or scissors.`);
        const cId = String(session.data.challenger);
        const oId = String(session.data.opponent);
        if (userId !== cId && userId !== oId)
            return this.customError('You are not a player in this game.');
        if (userId === cId) {
            if (session.data.challengerChoice)
                return this.customError('You have already made your choice.');
            session.data.challengerChoice = pick;
        }
        else {
            if (session.data.opponentChoice)
                return this.customError('You have already made your choice.');
            session.data.opponentChoice = pick;
        }
        const cChoice = session.data.challengerChoice;
        const oChoice = session.data.opponentChoice;
        if (!cChoice || !oChoice)
            return this.successJSON({ waiting: true, chosen: pick });
        let winner = null, outcome = 'draw';
        if (BEATS[cChoice] === oChoice) {
            winner = cId;
            outcome = 'win';
        }
        else if (BEATS[oChoice] === cChoice) {
            winner = oId === 'bot' ? 'bot' : oId;
            outcome = 'lose';
        }
        if (winner && winner !== 'bot') {
            const p = session.players.get(winner);
            if (p) {
                p.score += 300;
                p.correctAnswers += 1;
            }
        }
        const ext = ctx.client.getExtension(index_js_1.ForgeGames, true);
        ext['emitter'].emit(winner && winner !== 'bot' ? 'gamesAnswerCorrect' : 'gamesAnswerWrong', session.id, session.guildId, session.channelId, winner ?? cId, pick, 300);
        return this.successJSON({
            waiting: false,
            challengerChoice: cChoice,
            opponentChoice: oChoice,
            challengerEmoji: EMOJI[cChoice],
            opponentEmoji: EMOJI[oChoice],
            winner,
            outcome,
            isDraw: outcome === 'draw',
        });
    },
});
//# sourceMappingURL=gameRpsChoice.js.map