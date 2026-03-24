import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'
import { getWord } from '../../structures/WordData.js'

export default new NativeFunction({
  name: '$gameNewWordle',
  description: 'Starts a new Wordle round. Returns JSON: { maxGuesses, difficulty, wordLength }.',
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
    if (session.type !== 'wordle') return this.customError('This session is not a Wordle game.')
    if (session.status !== 'active') return this.customError('The game has not started yet.')

    const word = getWord(session.difficulty)
    const maxGuesses = session.difficulty === 'easy' ? 8 : session.difficulty === 'hard' ? 4 : 6

    session.data.word = word
    session.data.guesses = []
    session.data.results = []
    session.data.maxGuesses = maxGuesses

    return this.successJSON({ maxGuesses, difficulty: session.difficulty, wordLength: word.length })
  },
})
