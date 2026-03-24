"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameEvent',
    description: 'Returns data from the current ForgeGames event payload as JSON. Use inside game event handlers.',
    version: '1.0.0',
    unwrap: false,
    output: forgescript_1.ArgType.Json,
    execute(ctx) {
        return this.successJSON(ctx.runtime.extras ?? {});
    },
});
//# sourceMappingURL=gameEvent.js.map