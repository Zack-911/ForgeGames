import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameJoin',
  description: 'Joins the active game session in the given channel.',
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
      description: 'User joining (defaults to command caller)',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Boolean,
  execute(ctx, [guild, channel, user]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found in this channel.')
    if (session.status !== 'waiting')
      return this.customError('This game has already started and is not accepting new players.')
    if (session.players.size >= session.maxPlayers) return this.customError('This game is full.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')
    if (session.players.has(userId)) return this.customError('You have already joined this game.')

    sessions.addPlayer(session, userId)

    ctx.client
      .getExtension(ForgeGames, true)
      ['emitter'].emit('gamesPlayerJoin', session.id, g.id, ch.id, userId)

    return this.success(true)
  },
})
