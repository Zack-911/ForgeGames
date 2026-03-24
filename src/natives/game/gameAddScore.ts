import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameAddScore',
  description: 'Adds or subtracts points from a player. Returns the new score.',
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
      name: 'userID',
      description: 'Target user',
      type: ArgType.User,
      required: true,
      rest: false,
    },
    {
      name: 'points',
      description: 'Points to add (can be negative)',
      type: ArgType.Number,
      required: true,
      rest: false,
    },
  ],
  output: ArgType.Number,
  execute(_ctx, [sessionID, user, points]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')

    const player = session.players.get(user.id)
    if (!player) return this.customError('This user is not in the game.')

    player.score = Math.max(0, player.score + points)
    return this.success(player.score)
  },
})
