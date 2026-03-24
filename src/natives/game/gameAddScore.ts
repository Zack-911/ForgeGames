import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameAddScore',
  description: 'Adds (or subtracts) points to a player in the current game. Returns the new score.',
  version: '1.0.0',
  brackets: true,
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
  execute(ctx, [guild, channel, user, points]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')

    const player = session.players.get(user.id)
    if (!player) return this.customError('This user is not in the game.')

    player.score = Math.max(0, player.score + points)
    return this.success(player.score)
  },
})
