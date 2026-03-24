import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameIsActive',
  description: 'Returns true if the session is in the active (started) state.',
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
  ],
  output: ArgType.Boolean,
  execute(_ctx, [sessionID]) {
    const session = sessions.getById(sessionID)
    return this.success(session !== null && session.status === 'active')
  },
})
