import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameStats',
  description: 'Returns statistics for a player in the current game session as JSON.',
  version: '1.0.0',
  brackets: false,
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
      description: 'User to look up (defaults to caller)',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel, user]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')

    const player = session.players.get(userId)
    if (!player) return this.customError('This user is not in the game.')

    const total = player.correctAnswers + player.wrongAnswers
    const accuracy = total > 0 ? Math.round((player.correctAnswers / total) * 100) : 0

    return this.successJSON({
      userId: player.userId,
      score: player.score,
      correctAnswers: player.correctAnswers,
      wrongAnswers: player.wrongAnswers,
      totalAnswers: total,
      accuracy,
      joinedAt: player.joinedAt,
    })
  },
})
