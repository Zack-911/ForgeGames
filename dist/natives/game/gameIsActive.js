"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameIsActive',
    description: 'Returns true if the session is in the active (started) state.',
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
    execute(_ctx, [sessionID]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        return this.success(session !== null && session.status === 'active');
    },
});
//# sourceMappingURL=gameIsActive.js.map