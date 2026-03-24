"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameInfo',
    description: 'Returns a JSON object with information about the current game session.',
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
            name: 'field',
            description: 'Specific field to return (id|type|status|difficulty|playerCount|hostId|startedAt|timeoutMs)',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [guild, channel, field]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.customError('No guild or channel found.');
        const session = GameSession_js_1.sessions.get(g.id, ch.id);
        if (!session)
            return this.customError('No active game session found in this channel.');
        const info = {
            id: session.id,
            type: session.type,
            status: session.status,
            difficulty: session.difficulty,
            playerCount: session.players.size,
            maxPlayers: session.maxPlayers,
            hostId: session.hostId,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            timeoutMs: session.timeoutMs,
            data: session.data,
        };
        const val = info[field];
        if (val === undefined)
            return this.customError(`Unknown field "${field}"`);
        return this.successJSON(val);
    },
});
//# sourceMappingURL=gameInfo.js.map