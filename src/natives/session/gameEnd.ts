import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameEnd',
  description: 'Ends the active game session in the given channel.',
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
  ],
  output: ArgType.Boolean,
  execute(ctx, [guild, channel]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found in this channel.')

    const winnerId = sessions.leaderboard(session)[0]?.userId ?? null
    sessions.end(session)
    sessions.destroy(g.id, ch.id)

    ctx.client
      .getExtension(ForgeGames, true)
      ['emitter'].emit('gamesSessionEnd', session.id, session.type, g.id, ch.id, winnerId)

    return this.success(true)
  },
})
