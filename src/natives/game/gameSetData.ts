import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameSetData',
  description: "Stores a key-value pair in the game session's data store.",
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
      name: 'key',
      description: 'Data key',
      type: ArgType.String,
      required: true,
      rest: false,
    },
    {
      name: 'value',
      description: 'Data value',
      type: ArgType.String,
      required: true,
      rest: false,
    },
  ],
  output: ArgType.Boolean,
  execute(ctx, [guild, channel, key, value]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')
    session.data[key] = value
    return this.success(true)
  },
})
