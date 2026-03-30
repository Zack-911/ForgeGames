"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameStart',
    description: 'Starts a game session and begins its timeout timer.',
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
    ],
    output: forgescript_1.ArgType.Boolean,
    execute(ctx, [sessionID]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        if (session.status === 'active')
            return this.customError('The game is already running.');
        if (session.status === 'ended')
            return this.customError('This game has already ended.');
        GameSession_js_1.sessions.start(session);
        const ext = ctx.client.getExtension(index_js_1.ForgeGames, true);
        ext.events.emit('gamesSessionStart', session.id, session.type, session.guildId, session.channelId);
        GameSession_js_1.sessions.setTimeout(session, () => {
            if (session.status !== 'ended') {
                GameSession_js_1.sessions.end(session);
                GameSession_js_1.sessions.destroy(session.id);
                ext.events.emit('gamesSessionTimeout', session);
            }
        }, session.timeoutMs);
        return this.success(true);
    },
});
//# sourceMappingURL=gameStart.js.map