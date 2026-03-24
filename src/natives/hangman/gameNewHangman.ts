import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'
import { getHangmanWord } from '../../structures/HangmanData.js'

export default new NativeFunction({
  name: '$gameNewHangman',
  description:
    'Starts a Hangman round. Returns JSON: { wordLength, maxWrong, masked, guessed, wrongCount }.',
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
    if (session.type !== 'hangman') return this.customError('This session is not a Hangman game.')
    if (session.status !== 'active') return this.customError('The game has not started yet.')

    const word = getHangmanWord(session.difficulty)
    session.data.word = word
    session.data.guessed = []
    session.data.wrong = 0
    session.data.maxWrong = 6

    return this.successJSON({
      wordLength: word.length,
      maxWrong: 6,
      masked: Array.from(word).map(() => null),
      guessed: [],
      wrongCount: 0,
    })
  },
})
