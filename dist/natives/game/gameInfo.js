"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameInfo',
    description: 'Returns a specific field from a session as JSON. Fields: id|type|status|difficulty|playerCount|maxPlayers|hostId|guildId|channelId|startedAt|endedAt|timeoutMs',
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
            name: 'field',
            description: 'Field to return',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(_ctx, [sessionID, field]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        const info = {
            id: session.id,
            type: session.type,
            status: session.status,
            difficulty: session.difficulty,
            playerCount: session.players.size,
            maxPlayers: session.maxPlayers,
            hostId: session.hostId,
            guildId: session.guildId,
            channelId: session.channelId,
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