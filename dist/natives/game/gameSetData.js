"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameSetData',
    description: "Stores a key-value pair in the game session's data store.",
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
            name: 'key',
            description: 'Data key',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: 'value',
            description: 'Data value',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Boolean,
    execute(ctx, [guild, channel, key, value]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.customError('No guild or channel found.');
        const session = GameSession_js_1.sessions.get(g.id, ch.id);
        if (!session)
            return this.customError('No active game session found.');
        session.data[key] = value;
        return this.success(true);
    },
});
//# sourceMappingURL=gameSetData.js.map