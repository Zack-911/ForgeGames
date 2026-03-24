"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgeGamesEventHandler = exports.ForgeGamesCommandManager = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../index.js");
// ============================================================
//  Command manager — stores bot commands keyed by event name
// ============================================================
class ForgeGamesCommandManager extends forgescript_1.BaseCommandManager {
    handlerName = 'ForgeGames';
}
exports.ForgeGamesCommandManager = ForgeGamesCommandManager;
// ============================================================
//  Event handler base — hooks into the extension's emitter
// ============================================================
class ForgeGamesEventHandler extends forgescript_1.BaseEventHandler {
    register(client) {
        client
            .getExtension(index_js_1.ForgeGames, true)['emitter'].on(this.name, this.listener.bind(client));
    }
}
exports.ForgeGamesEventHandler = ForgeGamesEventHandler;
//# sourceMappingURL=ForgeGamesEventManager.js.map