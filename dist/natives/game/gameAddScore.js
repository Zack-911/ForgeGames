"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameAddScore',
    description: 'Adds (or subtracts) points to a player in the current game. Returns the new score.',
    version: '1.0.0',
    brackets: true,
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
    execute(ctx, [guild, channel, user, points]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.customError('No guild or channel found.');
        const session = GameSession_js_1.sessions.get(g.id, ch.id);
        if (!session)
            return this.customError('No active game session found.');
        const player = session.players.get(user.id);
        if (!player)
            return this.customError('This user is not in the game.');
        player.score = Math.max(0, player.score + points);
        return this.success(player.score);
    },
});
//# sourceMappingURL=gameAddScore.js.map