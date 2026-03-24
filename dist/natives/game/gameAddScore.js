"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameAddScore',
    description: 'Adds or subtracts points from a player. Returns the new score.',
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
            name: 'userID',
            description: 'Target user',
            type: forgescript_1.ArgType.User,
            required: true,
            rest: false,
        },
        {
            name: 'points',
            description: 'Points to add (can be negative)',
            type: forgescript_1.ArgType.Number,
            required: true,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Number,
    execute(_ctx, [sessionID, user, points]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        const player = session.players.get(user.id);
        if (!player)
            return this.customError('This user is not in the game.');
        player.score = Math.max(0, player.score + points);
        return this.success(player.score);
    },
});
//# sourceMappingURL=gameAddScore.js.map