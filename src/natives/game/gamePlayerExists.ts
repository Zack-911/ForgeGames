import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gamePlayerExists',
  description: 'Returns true if the user has joined the session.',
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
      name: 'userID',
      description: 'User to check (defaults to caller)',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Boolean,
  execute(ctx, [sessionID, user]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.success(false)
    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.success(false)
    return this.success(session.players.has(userId))
  },
})
