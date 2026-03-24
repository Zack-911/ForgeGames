import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameGuildSessions',
  description: 'Returns a JSON array of all sessions in a guild, optionally filtered by channel.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'guildID',
      description: 'Guild to query',
      type: ArgType.Guild,
      required: true,
      rest: false,
    },
    {
      name: 'channelID',
      description: 'Filter to a specific channel (optional)',
      type: ArgType.Channel,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel]) {
    const g = guild ?? ctx.guild
    if (!g) return this.customError('No guild found.')

    const all = sessions.forGuild(g.id, channel?.id).map((s) => ({
      id: s.id,
      type: s.type,
      channelId: s.channelId,
      status: s.status,
      difficulty: s.difficulty,
      playerCount: s.players.size,
      startedAt: s.startedAt,
    }))
    return this.successJSON(all)
  },
})
