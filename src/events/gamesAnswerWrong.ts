import { Interpreter } from '@tryforge/forgescript'

import { ForgeGames } from '..'
import { ForgeGamesEventHandler } from '../structures/ForgeGamesEventManager.js'

export default new ForgeGamesEventHandler({
  name: 'gamesAnswerWrong',
  version: '1.0.0',
  description: 'Triggered on the gamesAnswerWrong event',
  listener(sessionId, guildId, channelId, userId, answer) {
    const commands = this.getExtension(ForgeGames, true).commands.get('gamesAnswerWrong')

    for (const command of commands) {
      Interpreter.run({
        obj: (this.channels.cache.get(channelId) ?? this.guilds.cache.get(guildId) ?? {}) as any,
        client: this,
        command,
        data: command.compiled.code,
        extras: {
          sessionId,
          guildId,
          channelId,
          userId,
          answer,
        },
      })
    }
  },
})
