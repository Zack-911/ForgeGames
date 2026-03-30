"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameScrambleAnswer',
    description: 'Submits a scramble answer. Returns JSON: { correct, answer, correctWord, pointsEarned, score }.',
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
            name: 'answer',
            description: 'Unscrambled word attempt',
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
    execute(ctx, [sessionID, answer, user]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        if (session.type !== 'scramble')
            return this.customError('This session is not a Scramble game.');
        if (session.status !== 'active')
            return this.customError('The game is not active.');
        if (!session.data.word)
            return this.customError('No word loaded. Use $gameNewScramble first.');
        if (session.data.answered)
            return this.customError('This round has already been answered.');
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.customError('Could not determine user.');
        if (!session.players.has(userId))
            return this.customError('You are not in this game. Use $gameJoin first.');
        const correctWord = String(session.data.word);
        const isCorrect = answer.toLowerCase().trim() === correctWord.toLowerCase();
        const player = session.players.get(userId);
        const ext = ctx.client.getExtension(index_js_1.ForgeGames, true);
        const points = Number(session.data.points ?? 200);
        if (isCorrect) {
            player.score += points;
            player.correctAnswers += 1;
            session.data.answered = true;
            GameSession_js_1.sessions.clearTimeout(session);
        }
        else {
            player.wrongAnswers += 1;
        }
        ext.events.emit('gamesScrambleAnswer', session.id, session.guildId, session.channelId, userId, answer, isCorrect);
        return this.successJSON({
            correct: isCorrect,
            answer,
            correctWord: isCorrect ? correctWord : null,
            pointsEarned: isCorrect ? points : 0,
            score: player.score,
        });
    },
});
//# sourceMappingURL=gameScrambleAnswer.js.map