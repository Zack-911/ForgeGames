"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameEnd',
    description: 'Ends and destroys a game session by its UUID.',
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
        const winnerId = GameSession_js_1.sessions.leaderboard(session)[0]?.userId ?? null;
        GameSession_js_1.sessions.end(session);
        GameSession_js_1.sessions.destroy(session.id);
        ctx.client
            .getExtension(index_js_1.ForgeGames, true)['emitter'].emit('gamesSessionEnd', session.id, session.type, session.guildId, session.channelId, winnerId);
        return this.success(true);
    },
});
//# sourceMappingURL=gameEnd.js.map