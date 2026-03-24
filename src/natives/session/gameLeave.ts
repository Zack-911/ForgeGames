import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameLeave',
  description: 'Removes a player from a game session.',
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
      name: 'userID',
      description: 'User to remove (defaults to command caller)',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Boolean,
  execute(ctx, [sessionID, user]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')
    if (!session.players.has(userId)) return this.customError('This user is not in the game.')

    sessions.removePlayer(session, userId)

    ctx.client
      .getExtension(ForgeGames, true)
      ['emitter'].emit('gamesPlayerLeave', session.id, session.guildId, session.channelId, userId)

    return this.success(true)
  },
})
