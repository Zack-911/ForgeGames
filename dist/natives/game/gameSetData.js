"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameSetData',
    description: "Stores a key-value pair in the session's data store.",
    version: '1.0.0',
    brackets: true,
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
    execute(_ctx, [sessionID, key, value]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        session.data[key] = value;
        return this.success(true);
    },
});
//# sourceMappingURL=gameSetData.js.map