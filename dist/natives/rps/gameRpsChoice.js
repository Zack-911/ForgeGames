"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
const BEATS = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
const EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️' };
exports.default = new forgescript_1.NativeFunction({
    name: '$gameRpsChoice',
    description: 'Submits a rock/paper/scissors choice. When both players have chosen, returns a result JSON.',
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        {
            name: 'guildID',
            description: 'Guild of the session',
            type: forgescript_1.ArgType.Guild,
            required: true,
            rest: false,
        },
        {
            name: 'channelID',
            description: 'Channel of the session',
            type: forgescript_1.ArgType.Channel,
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
    execute(ctx, [guild, channel, choice, user]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.customError('No guild or channel found.');
        const session = GameSession_js_1.sessions.get(g.id, ch.id);
        if (!session)
            return this.customError('No active game session found.');
        if (session.type !== 'rps')
            return this.customError('This session is not an RPS game.');
        if (session.status !== 'active')
            return this.customError('The game is not active.');
        if (!session.data.challenger)
            return this.customError('RPS not initialised. Use $gameNewRps first.');
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.customError('Could not determine user.');
        const valid = ['rock', 'paper', 'scissors'];
        const pick = choice.toLowerCase().trim();
        if (!valid.includes(pick))
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
        if (!cChoice || !oChoice) {
            return this.successJSON({ waiting: true, chosen: pick });
        }
        let winner = null;
        let outcome = 'draw';
        if (BEATS[cChoice] === oChoice) {
            winner = cId;
            outcome = 'win';
        }
        else if (BEATS[oChoice] === cChoice) {
            winner = oId === 'bot' ? 'bot' : oId;
            outcome = 'lose';
        }
        if (winner && winner !== 'bot') {
            const player = session.players.get(winner);
            if (player) {
                player.score += 300;
                player.correctAnswers += 1;
            }
        }
        const ext = ctx.client.getExtension(index_js_1.ForgeGames, true);
        ext['emitter'].emit(winner && winner !== 'bot' ? 'gamesAnswerCorrect' : 'gamesAnswerWrong', session.id, g.id, ch.id, winner ?? cId, pick, 300);
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