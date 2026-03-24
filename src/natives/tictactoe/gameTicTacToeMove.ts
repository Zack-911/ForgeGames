import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

const WINNING_LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default new NativeFunction({
  name: '$gameTicTacToeMove',
  description:
    'Makes a move (position 1–9). Returns JSON: { board, position, symbol, winner, draw, nextTurn, playerX, playerO, pointsEarned }.',
  version: '1.0.0',
  brackets: true,
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
      name: 'position',
      description: 'Cell 1–9 (top-left to bottom-right)',
      type: ArgType.Number,
      required: true,
      rest: false,
    },
    {
      name: 'userID',
      description: 'Override user ID',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(ctx, [sessionID, position, user]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
    if ((session.type as string) !== 'tictactoe')
      return this.customError('This session is not a Tic-Tac-Toe game.')
    if (session.status !== 'active') return this.customError('The game is not active.')
    if (!session.data.board)
      return this.customError('Board not set up. Use $gameNewTicTacToe first.')
    if (session.data.winner) return this.customError('The game is already over.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')

    const xId = String(session.data.playerX)
    const oId = String(session.data.playerO)
    if (userId !== xId && userId !== oId)
      return this.customError('You are not a player in this game.')
    if (userId !== String(session.data.currentTurn)) return this.customError('It is not your turn.')

    const idx = position - 1
    if (idx < 0 || idx > 8) return this.customError('Position must be between 1 and 9.')

    const board = session.data.board as (string | null)[]
    if (board[idx] !== null) return this.customError(`Cell ${position} is already taken.`)

    const symbol = userId === xId ? 'X' : 'O'
    board[idx] = symbol

    let winner: string | null = null
    for (const [a, b, c] of WINNING_LINES) {
      if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
        winner = userId
        session.data.winner = userId
        const p = session.players.get(userId)
        if (p) {
          p.score += 500
          p.correctAnswers += 1
        }
        break
      }
    }

    const draw = !winner && board.every((c) => c !== null)
    if (draw) session.data.winner = 'draw'
    if (!winner && !draw) session.data.currentTurn = userId === xId ? oId : xId

    ctx.client
      .getExtension(ForgeGames, true)
      [
        'emitter'
      ].emit('gamesAnswerCorrect' as any, session.id, session.guildId, session.channelId, userId, String(position), winner ? 500 : 0)

    return this.successJSON({
      board,
      position,
      symbol,
      winner,
      draw,
      nextTurn: winner || draw ? null : session.data.currentTurn,
      playerX: xId,
      playerO: oId,
      pointsEarned: winner ? 500 : 0,
    })
  },
})
