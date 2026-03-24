import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameInfo',
  description: 'Returns a JSON object with information about the current game session.',
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
      name: 'field',
      description:
        'Specific field to return (id|type|status|difficulty|playerCount|hostId|startedAt|timeoutMs)',
      type: ArgType.String,
      required: true,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel, field]) {
    const g  = guild   ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found in this channel.')

    const info = {
      id:          session.id,
      type:        session.type,
      status:      session.status,
      difficulty:  session.difficulty,
      playerCount: session.players.size,
      maxPlayers:  session.maxPlayers,
      hostId:      session.hostId,
      startedAt:   session.startedAt,
      endedAt:     session.endedAt,
      timeoutMs:   session.timeoutMs,
      data:        session.data,
    }

    const val = (info as Record<string, unknown>)[field]
    if (val === undefined) return this.customError(`Unknown field "${field}"`)
    return this.successJSON(val as object)
  },
})
