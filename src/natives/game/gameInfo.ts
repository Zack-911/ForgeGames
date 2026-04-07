import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameInfo',
  description:
    'Returns a specific field from a session as JSON. Fields: id|type|status|difficulty|playerCount|maxPlayers|hostId|guildId|channelId|startedAt|endedAt|timeoutMs',
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
      name: 'field',
      description: 'Field to return',
      type: ArgType.String,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(_ctx, [sessionID, field]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')

    const info: Record<string, unknown> = {
      id: session.id,
      type: session.type,
      status: session.status,
      difficulty: session.difficulty,
      playerCount: session.players.size,
      maxPlayers: session.maxPlayers,
      hostId: session.hostId,
      guildId: session.guildId,
      channelId: session.channelId,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      timeoutMs: session.timeoutMs,
      data: session.data,
    }
    if (!field) return this.successJSON(info)
    const val = info[field]
    if (val === undefined) return this.customError(`Unknown field "${field}"`)
    return this.successJSON(val as object)
  },
})
