import { ForgeClient } from '@tryforge/forgescript'

import { ForgeGames } from '../index'

const games = new ForgeGames()

const client = new ForgeClient({
  intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildVoiceStates'],
  events: ['messageCreate', 'interactionCreate'],
  extensions: [games],
  prefixes: ['.'],
})

games.events.on('gamesSessionTimeout', (session) => {
  console.log(`[TEST] Session ${session.id} of type ${session.type} timed out!`)
  console.log(`[TEST] Data:`, session.data)
})

client.commands.add({
  name: 'e',
  type: 'messageCreate',
  code: '$onlyForUsers[Not for you!;$botOwnerID] $eval[$message]',
})

client.login(process.env.BOT_TOKEN)
