"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const __1 = require("..");
const ForgeGamesEventManager_js_1 = require("../structures/ForgeGamesEventManager.js");
exports.default = new ForgeGamesEventManager_js_1.ForgeGamesEventHandler({
    name: 'gamesWordleGuess',
    version: '1.0.0',
    description: 'Triggered on the gamesWordleGuess event',
    listener(sessionId, guildId, channelId, userId, guess, result) {
        const commands = this.getExtension(__1.ForgeGames, true).commands.get('gamesWordleGuess');
        for (const command of commands) {
            forgescript_1.Interpreter.run({
                obj: (this.channels.cache.get(channelId) ?? this.guilds.cache.get(guildId) ?? {}),
                client: this,
                command,
                data: command.compiled.code,
                extras: {
                    sessionId,
                    guildId,
                    channelId,
                    userId,
                    guess,
                    result,
                },
            });
        }
    },
});
//# sourceMappingURL=gamesWordleGuess.js.map