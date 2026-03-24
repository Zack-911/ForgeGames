"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const ForgeGamesEventManager_js_1 = require("../structures/ForgeGamesEventManager.js");
exports.default = new ForgeGamesEventManager_js_1.ForgeGamesEventHandler({
    name: 'error',
    version: '1.0.0',
    description: 'Internal error handler',
    listener(err) {
        forgescript_1.Logger.error('[ForgeGames] Internal error:', err);
    },
});
//# sourceMappingURL=error.js.map