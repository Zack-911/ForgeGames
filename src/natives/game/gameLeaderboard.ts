import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameLeaderboard',
  description: 'Returns a JSON array of players sorted by score (highest first).',
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
      name: 'limit',
      description: 'How many entries to return (default: all)',
      type: ArgType.Number,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(_ctx, [sessionID, limit]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')

    const board = sessions.leaderboard(session)
    const slice = limit ? board.slice(0, limit) : board
    return this.successJSON(slice.map((p, i) => ({ rank: i + 1, ...p })))
  },
})
