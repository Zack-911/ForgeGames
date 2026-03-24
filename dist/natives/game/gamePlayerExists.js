"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gamePlayerExists',
    description: 'Returns true if the user has joined the session.',
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
            name: 'userID',
            description: 'User to check (defaults to caller)',
            type: forgescript_1.ArgType.User,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Boolean,
    execute(ctx, [sessionID, user]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.success(false);
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.success(false);
        return this.success(session.players.has(userId));
    },
});
//# sourceMappingURL=gamePlayerExists.js.map