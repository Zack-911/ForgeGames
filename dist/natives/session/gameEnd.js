"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameEnd',
    description: 'Ends the active game session in the given channel.',
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
    ],
    output: forgescript_1.ArgType.Boolean,
    execute(ctx, [guild, channel]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.customError('No guild or channel found.');
        const session = GameSession_js_1.sessions.get(g.id, ch.id);
        if (!session)
            return this.customError('No active game session found in this channel.');
        const winnerId = GameSession_js_1.sessions.leaderboard(session)[0]?.userId ?? null;
        GameSession_js_1.sessions.end(session);
        GameSession_js_1.sessions.destroy(g.id, ch.id);
        ctx.client
            .getExtension(index_js_1.ForgeGames, true)['emitter'].emit('gamesSessionEnd', session.id, session.type, g.id, ch.id, winnerId);
        return this.success(true);
    },
});
//# sourceMappingURL=gameEnd.js.map