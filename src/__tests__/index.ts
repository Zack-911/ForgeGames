import { ForgeClient } from "@tryforge/forgescript";
import { ForgeGames } from "../index";


const client = new ForgeClient({
  intents: [
    'Guilds',
    'GuildMessages',
    'MessageContent',
    'GuildVoiceStates'
  ],
  events: [
    'messageCreate',
    'interactionCreate'
  ],
  extensions: [new ForgeGames()],
  prefixes: ['.']
})

client.commands.add({
  name: 'e',
  type: 'messageCreate',
  code: '$onlyForUsers[Not for you!;$botOwnerID] $eval[$message]'
})

client.login(process.env.BOT_TOKEN)