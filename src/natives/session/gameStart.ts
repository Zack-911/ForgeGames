import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameStart',
  description: 'Starts a game session and begins its timeout timer.',
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
    if (session.status === 'active') return this.customError('The game is already running.')
    if (session.status === 'ended') return this.customError('This game has already ended.')

    sessions.start(session)

    const ext = ctx.client.getExtension(ForgeGames, true)
    ext.events.emit(
      'gamesSessionStart',
      session.id,
      session.type,
      session.guildId,
      session.channelId,
    )

    sessions.setTimeout(
      session,
      () => {
        if (session.status !== 'ended') {
          sessions.end(session)
          sessions.destroy(session.id)
          ext.events.emit('gamesSessionTimeout', session)
        }
      },
      session.timeoutMs,
    )

    return this.success(true)
  },
})
