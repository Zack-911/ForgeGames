import { Logger } from '@tryforge/forgescript'

import { ForgeGamesEventHandler } from '../structures/ForgeGamesEventManager.js'

export default new ForgeGamesEventHandler({
  name: 'error' as any,
  version: '1.0.0',
  description: 'Internal error handler',
  listener(err: Error) {
    Logger.error('[ForgeGames] Internal error:', err)
  },
})
