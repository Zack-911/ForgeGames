"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameStats',
    description: 'Returns statistics for a player in the current game session as JSON.',
    version: '1.0.0',
    brackets: false,
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
            name: 'userID',
            description: 'User to look up (defaults to caller)',
            type: forgescript_1.ArgType.User,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [guild, channel, user]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.customError('No guild or channel found.');
        const session = GameSession_js_1.sessions.get(g.id, ch.id);
        if (!session)
            return this.customError('No active game session found.');
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