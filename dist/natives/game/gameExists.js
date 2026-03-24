"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameExists',
    description: 'Returns true if any game session (waiting or active) exists in the current channel.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'guildID',
            description: 'Guild to check',
            type: forgescript_1.ArgType.Guild,
            required: true,
            rest: false,
        },
        {
            name: 'channelID',
            description: 'Channel to check',
            type: forgescript_1.ArgType.Channel,
            required: true,
            rest: false,
        }
    ],
    output: forgescript_1.ArgType.Boolean,
    execute(ctx, [guild, channel]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.success(false);
        return this.success(GameSession_js_1.sessions.get(g.id, ch.id) !== null);
    },
});
//# sourceMappingURL=gameExists.js.map