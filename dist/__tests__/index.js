"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_1 = require("../index");
const games = new index_1.ForgeGames();
const client = new forgescript_1.ForgeClient({
    intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildVoiceStates'],
    events: ['messageCreate', 'interactionCreate'],
    extensions: [games],
    prefixes: ['.'],
});
games.events.on('gamesSessionTimeout', (session) => {
    console.log(`[TEST] Session ${session.id} of type ${session.type} timed out!`);
    console.log(`[TEST] Data:`, session.data);
});
client.commands.add({
    name: 'e',
    type: 'messageCreate',
    code: '$onlyForUsers[Not for you!;$botOwnerID] $eval[$message]',
});
client.login(process.env.BOT_TOKEN);
//# sourceMappingURL=index.js.map