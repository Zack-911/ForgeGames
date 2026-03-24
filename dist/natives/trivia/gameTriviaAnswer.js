"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameTriviaAnswer',
    description: 'Submits an answer to the current trivia question. Returns JSON: { correct, answer, correctAnswer, pointsEarned, score }.',
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
            description: "The player's answer",
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
        if (session.type !== 'trivia')
            return this.customError('This session is not a trivia game.');
        if (session.status !== 'active')
            return this.customError('The game is not currently active.');
        if (!session.data.question)
            return this.customError('No question loaded. Use $gameNewTrivia first.');
        if (session.data.answered)
            return this.customError('This question has already been answered.');
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.customError('Could not determine user.');
        if (!session.players.has(userId))
            return this.customError('You are not in this game. Use $gameJoin first.');
        const normalise = (s) => s
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s]/g, '');
        const correct = normalise(String(session.data.answer));
        const given = normalise(answer);
        const isCorrect = given === correct || correct.startsWith(given);
        const player = session.players.get(userId);
        const ext = ctx.client.getExtension(index_js_1.ForgeGames, true);
        const points = Number(session.data.points ?? 100);
        if (isCorrect) {
            player.score += points;
            player.correctAnswers += 1;
            session.data.answered = true;
            GameSession_js_1.sessions.clearTimeout(session);
            ext['emitter'].emit('gamesAnswerCorrect', session.id, session.guildId, session.channelId, userId, answer, points);
        }
        else {
            player.wrongAnswers += 1;
            ext['emitter'].emit('gamesAnswerWrong', session.id, session.guildId, session.channelId, userId, answer);
        }
        return this.successJSON({
            correct: isCorrect,
            answer,
            correctAnswer: isCorrect ? String(session.data.answer) : null,
            pointsEarned: isCorrect ? points : 0,
            score: player.score,
        });
    },
});
//# sourceMappingURL=gameTriviaAnswer.js.map