import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameSetData',
  description: "Stores a key-value pair in the session's data store.",
  version: '1.0.0',
  brackets: true,
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
      name: 'key',
      description: 'Data key',
      type: ArgType.String,
      required: true,
      rest: false,
    },
    {
      name: 'value',
      description: 'Data value',
      type: ArgType.String,
      required: true,
      rest: false,
    },
  ],
  output: ArgType.Boolean,
  execute(_ctx, [sessionID, key, value]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
    session.data[key] = value
    return this.success(true)
  },
})
