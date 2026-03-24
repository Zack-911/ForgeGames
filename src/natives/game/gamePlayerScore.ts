import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gamePlayerScore',
  description: 'Returns the score of a player in the session.',
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
      description: 'User to look up (defaults to command caller)',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Number,
  execute(ctx, [sessionID, user]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')

    const player = session.players.get(userId)
    if (!player) return this.customError('This user is not in the game.')
    return this.success(player.score)
  },
})
