import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameStart',
  description: 'Starts the game session and begins the timer.',
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
    if (!session) return this.customError('No game session found in this channel.')
    if (session.status === 'active') return this.customError('The game is already running.')
    if (session.status === 'ended') return this.customError('This game has already ended.')

    sessions.start(session)

    const ext = ctx.client.getExtension(ForgeGames, true)
    ext['emitter'].emit('gamesSessionStart', session.id, session.type, g.id, ch.id)

    sessions.setTimeout(
      session,
      () => {
        if (session.status !== 'ended') {
          sessions.end(session)
          sessions.destroy(g.id, ch.id)
          ext['emitter'].emit('gamesSessionTimeout', session.id, session.type, g.id, ch.id)
        }
      },
      session.timeoutMs,
    )

    return this.success(true)
  },
})
