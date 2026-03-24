import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'
import { getWord, scramble } from '../../structures/WordData.js'

export default new NativeFunction({
  name: '$gameNewScramble',
  description:
    'Generates a scrambled word. Returns JSON: { scrambled, wordLength, points, difficulty }.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    {
      name: 'sessionID',
      description: 'Session UUID returned by $gameCreate',
      type: ArgType.String,
      required: true,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(_ctx, [sessionID]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
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
