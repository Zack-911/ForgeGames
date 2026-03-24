import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'
import { getWord, scramble } from '../../structures/WordData.js'

export default new NativeFunction({
  name: '$gameNewScramble',
  description: [
    'Generates a scrambled word for players to unscramble.',
    'Returns JSON: { scrambled, wordLength, points, difficulty }.',
    'The correct answer is never revealed until someone solves it or the game ends.',
  ].join(' '),
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    { name: 'guildID', description: 'Guild of the session', type: ArgType.Guild, required: true, rest: false },
    { name: 'channelID', description: 'Channel of the session', type: ArgType.Channel, required: true, rest: false },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')
    if (session.type !== 'scramble') return this.customError('This session is not a Scramble game.')
    if (session.status !== 'active') return this.customError('The game has not started yet.')

    const word = getWord(session.difficulty)
    const scrambled = scramble(word)
    const points = session.difficulty === 'easy' ? 100 : session.difficulty === 'hard' ? 400 : 200

    session.data.word = word
    session.data.scrambled = scrambled
    session.data.points = points
    session.data.answered = false

    return this.successJSON({
      scrambled,
      wordLength: word.length,
      points,
      difficulty: session.difficulty,
    })
  },
})
