"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameNewRps',
    description: [
        'Initialises a Rock-Paper-Scissors round.',
        'Returns JSON: { challenger, opponent, isBotOpponent }.',
        'Omit opponentID to play against the bot.',
    ].join(' '),
    version: '1.0.0',
    brackets: false,
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
            name: 'opponentID',
            description: 'Opponent user (omit for bot play)',
            type: forgescript_1.ArgType.User,
            required: false,
            rest: false,
        },
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
        if (session.type !== 'rps')
            return this.customError('This session is not an RPS game.');
        if (session.status !== 'active')
            return this.customError('The game has not started yet.');
        const hostId = session.hostId;
        const opponentId = opponent?.id ?? 'bot';
        if (opponentId !== 'bot' && opponentId === hostId)
            return this.customError('The opponent cannot be the same as the host.');
        session.data.challenger = hostId;
        session.data.opponent = opponentId;
        session.data.challengerChoice = null;
        session.data.opponentChoice =
            opponentId === 'bot' ? ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)] : null;
        GameSession_js_1.sessions.addPlayer(session, hostId);
        if (opponentId !== 'bot')
            GameSession_js_1.sessions.addPlayer(session, opponentId);
        return this.successJSON({
            challenger: hostId,
            opponent: opponentId,
            isBotOpponent: opponentId === 'bot',
        });
    },
});
//# sourceMappingURL=gameNewRps.js.map