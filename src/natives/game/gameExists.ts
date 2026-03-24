import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameExists',
  description:
    'Returns true if any game session (waiting or active) exists in the current channel.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'guildID',
      description: 'Guild to check',
      type: ArgType.Guild,
      required: true,
      rest: false,
    },
    {
      name: 'channelID',
      description: 'Channel to check',
      type: ArgType.Channel,
      required: true,
      rest: false,
    }
  ],
  output: ArgType.Boolean,
  execute(ctx, [guild, channel]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.success(false)
    return this.success(sessions.get(g.id, ch.id) !== null)
  },
})
