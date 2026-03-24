"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameNewTicTacToe',
    description: [
        'Sets up a Tic-Tac-Toe board. The host is X, the challenged player is O.',
        'Returns JSON: { board, playerX, playerO, currentTurn }.',
        'board is a 9-element array of "X", "O", or null (index 0 = top-left, 8 = bottom-right).',
    ].join(' '),
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'guildID', description: 'Guild of the session', type: forgescript_1.ArgType.Guild, required: true, rest: false },
        { name: 'channelID', description: 'Channel of the session', type: forgescript_1.ArgType.Channel, required: true, rest: false },
        { name: 'opponentID', description: 'User ID of the O player', type: forgescript_1.ArgType.User, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [guild, channel, opponent]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.customError('No guild or channel found.');
        const session = GameSession_js_1.sessions.get(g.id, ch.id);
        if (!session)
            return this.customError('No active game session found.');
        if (session.type !== 'tictactoe')
            return this.customError('This session is not a Tic-Tac-Toe game.');
        if (session.status !== 'active')
            return this.customError('The game has not started yet.');
        if (opponent.id === session.hostId)
            return this.customError('The opponent cannot be the same as the host.');
        if (opponent.bot)
            return this.customError('Bots cannot be opponents in Tic-Tac-Toe.');
        const board = Array(9).fill(null);
        session.data.board = board;
        session.data.playerX = session.hostId;
        session.data.playerO = opponent.id;
        session.data.currentTurn = session.hostId;
        session.data.winner = null;
        GameSession_js_1.sessions.addPlayer(session, session.hostId);
        GameSession_js_1.sessions.addPlayer(session, opponent.id);
        return this.successJSON({
            board,
            playerX: session.hostId,
            playerO: opponent.id,
            currentTurn: session.hostId,
        });
    },
});
//# sourceMappingURL=gameNewTicTacToe.js.map