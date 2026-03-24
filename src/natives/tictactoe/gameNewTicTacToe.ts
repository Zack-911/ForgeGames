import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
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
    { name: 'guildID',    description: 'Guild of the session',   type: ArgType.Guild,   required: true, rest: false },
    { name: 'channelID',  description: 'Channel of the session', type: ArgType.Channel, required: true, rest: false },
    { name: 'opponentID', description: 'User ID of the O player', type: ArgType.User,   required: true, rest: false },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel, opponent]) {
    const g  = guild   ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session)                               return this.customError('No active game session found.')
    if ((session.type as string) !== 'tictactoe') return this.customError('This session is not a Tic-Tac-Toe game.')
    if (session.status !== 'active')            return this.customError('The game has not started yet.')
    if (opponent.id === session.hostId)         return this.customError('The opponent cannot be the same as the host.')
    if (opponent.bot)                           return this.customError('Bots cannot be opponents in Tic-Tac-Toe.')

    const board: (string | null)[] = Array(9).fill(null)
    session.data.board       = board
    session.data.playerX     = session.hostId
    session.data.playerO     = opponent.id
    session.data.currentTurn = session.hostId
    session.data.winner      = null

    sessions.addPlayer(session, session.hostId)
    sessions.addPlayer(session, opponent.id)

    return this.successJSON({
      board,
      playerX:     session.hostId,
      playerO:     opponent.id,
      currentTurn: session.hostId,
    })
  },
})
