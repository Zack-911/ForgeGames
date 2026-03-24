import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameEnd',
  description: 'Ends and destroys a game session by its UUID.',
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
  ],
  output: ArgType.Boolean,
  execute(ctx, [sessionID]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')

    const winnerId = sessions.leaderboard(session)[0]?.userId ?? null
    sessions.end(session)
    sessions.destroy(session.id)

    ctx.client
      .getExtension(ForgeGames, true)
      [
        'emitter'
      ].emit('gamesSessionEnd', session.id, session.type, session.guildId, session.channelId, winnerId)

    return this.success(true)
  },
})
