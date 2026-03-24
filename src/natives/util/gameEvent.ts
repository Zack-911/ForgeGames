import { ArgType, NativeFunction } from '@tryforge/forgescript'

export default new NativeFunction({
  name: '$gameEvent',
  description:
    'Returns data from the current ForgeGames event payload as JSON. Use inside game event handlers.',
  version: '1.0.0',
  unwrap: false,
  output: ArgType.Json,
  execute(ctx) {
    return this.successJSON(ctx.runtime.extras ?? {})
  },
})
