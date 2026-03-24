"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameStart',
    description: 'Starts the game session and begins the timer.',
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
            return this.customError('No game session found in this channel.');
        if (session.status === 'active')
            return this.customError('The game is already running.');
        if (session.status === 'ended')
            return this.customError('This game has already ended.');
        GameSession_js_1.sessions.start(session);
        const ext = ctx.client.getExtension(index_js_1.ForgeGames, true);
        ext['emitter'].emit('gamesSessionStart', session.id, session.type, g.id, ch.id);
        GameSession_js_1.sessions.setTimeout(session, () => {
            if (session.status !== 'ended') {
                GameSession_js_1.sessions.end(session);
                GameSession_js_1.sessions.destroy(g.id, ch.id);
                ext['emitter'].emit('gamesSessionTimeout', session.id, session.type, g.id, ch.id);
            }
        }, session.timeoutMs);
        return this.success(true);
    },
});
//# sourceMappingURL=gameStart.js.map