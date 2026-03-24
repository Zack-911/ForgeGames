"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameLeaderboard',
    description: 'Returns a JSON array of players sorted by score (highest first).',
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
            name: 'limit',
            description: 'How many entries to return (default: all)',
            type: forgescript_1.ArgType.Number,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(_ctx, [sessionID, limit]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        const board = GameSession_js_1.sessions.leaderboard(session);
        const slice = limit ? board.slice(0, limit) : board;
        return this.successJSON(slice.map((p, i) => ({ rank: i + 1, ...p })));
    },
});
//# sourceMappingURL=gameLeaderboard.js.map