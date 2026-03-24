import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gamePlayerExists',
  description: 'Returns true if a user has joined the current game session.',
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
      description: 'User to check (defaults to caller)',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Boolean,
  execute(ctx, [guild, channel, user]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.success(false)

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.success(false)

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.success(false)
    return this.success(session.players.has(userId))
  },
})
