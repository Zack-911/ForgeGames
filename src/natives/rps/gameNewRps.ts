import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameNewRps',
  description:
    'Initialises an RPS round. Returns JSON: { challenger, opponent, isBotOpponent }. Omit opponentID for bot play.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'sessionID',
      description: 'Session UUID returned by $gameCreate',
      type: ArgType.String,
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
  execute(_ctx, [sessionID, opponent]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
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
