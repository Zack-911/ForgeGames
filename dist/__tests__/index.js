"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_1 = require("../index");
const client = new forgescript_1.ForgeClient({
    intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildVoiceStates'],
    events: ['messageCreate', 'interactionCreate'],
    extensions: [new index_1.ForgeGames()],
    prefixes: ['.'],
});
client.commands.add({
    name: 'e',
    type: 'messageCreate',
    code: '$onlyForUsers[Not for you!;$botOwnerID] $eval[$message]',
});
client.commands.add({
    name: 'wordle',
    type: 'messageCreate',
    code: `
$gameCreate[wordle;$guildID;$channelID;medium;300]
$gameJoin
$gameStart
$gameNewWordle[$guildID;$channelID]
`,
});
client.commands.add({
    name: 'trivia',
    type: 'messageCreate',
    code: `
$gameCreate[trivia;$guildID;$channelID;medium;300]
$gameJoin
$gameStart
$gameNewTrivia[$guildID;$channelID]
`,
});
client.commands.add({
    name: 'hangman',
    type: 'messageCreate',
    code: `
$gameCreate[hangman;$guildID;$channelID;medium;300]
$gameJoin
$gameStart
$gameNewHangman[$guildID;$channelID]
`,
});
client.commands.add({
    name: 'math',
    type: 'messageCreate',
    code: `
$gameCreate[math;$guildID;$channelID;medium;300]
$gameJoin
$gameStart
$gameNewMath[$guildID;$channelID]
`,
});
client.commands.add({
    name: 'scramble',
    type: 'messageCreate',
    code: `
$gameCreate[scramble;$guildID;$channelID;medium;300]
$gameJoin
$gameStart
$gameNewScramble[$guildID;$channelID]
`,
});
client.commands.add({
    name: 'tictactoe',
    type: 'messageCreate',
    code: `
$gameCreate[tictactoe;$guildID;$channelID;medium;300]
$gameJoin
$gameStart
$gameNewTicTacToe[$guildID;$channelID]
`,
});
client.commands.add({
    name: 'rps',
    type: 'messageCreate',
    code: `
$gameCreate[rps;$guildID;$channelID;medium;300]
$gameJoin
$gameStart
$gameNewRps[$guildID;$channelID]
`,
});
client.login(process.env.BOT_TOKEN);
//# sourceMappingURL=index.js.map