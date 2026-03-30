"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameJoin',
    description: 'Adds a player to a waiting game session.',
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
            description: 'User joining (defaults to command caller)',
            type: forgescript_1.ArgType.User,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Boolean,
    execute(ctx, [sessionID, user]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        if (session.status !== 'waiting')
            return this.customError('This game has already started and is not accepting new players.');
        if (session.players.size >= session.maxPlayers)
            return this.customError('This game is full.');
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.customError('Could not determine user.');
        if (session.players.has(userId))
            return this.customError('You have already joined this game.');
        GameSession_js_1.sessions.addPlayer(session, userId);
        ctx.client
            .getExtension(index_js_1.ForgeGames, true)
            .events.emit('gamesPlayerJoin', session.id, session.guildId, session.channelId, userId);
        return this.success(true);
    },
});
//# sourceMappingURL=gameJoin.js.map