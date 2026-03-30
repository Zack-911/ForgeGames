import { Interpreter } from '@tryforge/forgescript'

import { ForgeGames } from '..'
import { ForgeGamesEventHandler } from '../structures/ForgeGamesEventManager.js'

export default new ForgeGamesEventHandler({
  name: 'gamesSessionTimeout',
  version: '1.0.0',
  description: 'Triggered on the gamesSessionTimeout event',
  listener(session) {
    const commands = this.getExtension(ForgeGames, true).commands.get('gamesSessionTimeout')

    for (const command of commands) {
      Interpreter.run({
        obj: (this.channels.cache.get(session.channelId) ??
          this.guilds.cache.get(session.guildId) ??
          {}) as any,
        client: this,
        command,
        data: command.compiled.code,
        extras: {
          sessionId: session.id,
          type: session.type,
          guildId: session.guildId,
          channelId: session.channelId,
          ...session.data,
        },
      })
    }
  },
})
