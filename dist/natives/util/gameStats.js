"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameStats',
    description: 'Returns statistics for a player in the session as JSON.',
    version: '1.0.0',
    brackets: false,
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
            name: 'userID',
            description: 'User to look up (defaults to caller)',
            type: forgescript_1.ArgType.User,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [sessionID, user]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.customError('Could not determine user.');
        const player = session.players.get(userId);
        if (!player)
            return this.customError('This user is not in the game.');
        const total = player.correctAnswers + player.wrongAnswers;
        const accuracy = total > 0 ? Math.round((player.correctAnswers / total) * 100) : 0;
        return this.successJSON({
            userId: player.userId,
            score: player.score,
            correctAnswers: player.correctAnswers,
            wrongAnswers: player.wrongAnswers,
            totalAnswers: total,
            accuracy,
            joinedAt: player.joinedAt,
        });
    },
});
//# sourceMappingURL=gameStats.js.map