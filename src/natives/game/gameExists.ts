import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameExists',
  description: 'Returns true if a session with the given UUID exists (in any state).',
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
    return this.success(sessions.getById(sessionID) !== null)
  },
})
