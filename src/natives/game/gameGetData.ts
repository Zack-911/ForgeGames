import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameGetData',
  description: "Retrieves a value from the session's data store.",
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
      description: 'Data key to retrieve',
      type: ArgType.String,
      required: true,
      rest: false,
    },
  ],
  output: ArgType.String,
  execute(_ctx, [sessionID, key]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
    const val = session.data[key]
    if (val === undefined) return this.customError(`No data found for key "${key}"`)
    return this.success(String(val))
  },
})
