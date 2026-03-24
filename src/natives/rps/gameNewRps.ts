import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
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
      type: ArgType.Guild,
      required: true,
      rest: false,
    },
    {
      name: 'channelID',
      description: 'Channel of the session',
      type: ArgType.Channel,
      required: true,
      rest: false,
    },
    {
      name: 'opponentID',
      description: 'Opponent user (omit for bot play)',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel, opponent]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')
    if ((session.type as string) !== 'rps')
      return this.customError('This session is not an RPS game.')
    if (session.status !== 'active') return this.customError('The game has not started yet.')

    const hostId = session.hostId
    const opponentId = opponent?.id ?? 'bot'

    if (opponentId !== 'bot' && opponentId === hostId)
      return this.customError('The opponent cannot be the same as the host.')

    session.data.challenger = hostId
    session.data.opponent = opponentId
    session.data.challengerChoice = null
    session.data.opponentChoice =
      opponentId === 'bot' ? ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)]! : null

    sessions.addPlayer(session, hostId)
    if (opponentId !== 'bot') sessions.addPlayer(session, opponentId)

    return this.successJSON({
      challenger: hostId,
      opponent: opponentId,
      isBotOpponent: opponentId === 'bot',
    })
  },
})
