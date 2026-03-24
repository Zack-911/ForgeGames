import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameWordleGuessCount',
  description:
    'Returns JSON: { guessesUsed, guessesLeft, maxGuesses, history } with the full guess/tile history.',
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

    const guesses = (session.data.guesses as string[] | undefined) ?? []
    const results = (session.data.results as string[][] | undefined) ?? []
    const maxGuesses = (session.data.maxGuesses as number | undefined) ?? 6

    return this.successJSON({
      guessesUsed: guesses.length,
      guessesLeft: maxGuesses - guesses.length,
      maxGuesses,
      history: guesses.map((g, i) => ({ guess: g, tileArray: results[i] ?? [] })),
    })
  },
})
