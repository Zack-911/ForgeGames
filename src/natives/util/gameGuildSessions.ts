import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameGuildSessions',
  description: 'Returns a JSON array of all active game sessions in the given guild.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'guildID',
      description: 'Guild to query (defaults to current guild)',
      type: ArgType.Guild,
      required: true,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(ctx, [guild]) {
    const g = guild ?? ctx.guild
    if (!g) return this.customError('No guild found.')
    const all = sessions.forGuild(g.id).map((s) => ({
      id:          s.id,
      type:        s.type,
      channelId:   s.channelId,
      status:      s.status,
      difficulty:  s.difficulty,
      playerCount: s.players.size,
      startedAt:   s.startedAt,
    }))
    return this.successJSON(all)
  },
})
