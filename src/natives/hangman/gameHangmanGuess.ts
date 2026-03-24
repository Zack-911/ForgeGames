import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameHangmanGuess',
  description:
    'Guesses a letter. Returns JSON: { letter, correct, wrongCount, maxWrong, masked, guessed, won, lost, correctWord, pointsEarned }.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'sessionID',
      description: 'Session UUID returned by $gameCreate',
      type: ArgType.String,
      required: true,
      rest: false,
    },
    {
      name: 'letter',
      description: 'Single letter to guess',
      type: ArgType.String,
      required: true,
      rest: false,
    },
    {
      name: 'userID',
      description: 'Override user ID',
      type: ArgType.User,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(ctx, [sessionID, letter, user]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
    if (session.type !== 'hangman') return this.customError('This session is not a Hangman game.')
    if (session.status !== 'active') return this.customError('The game is not active.')
    if (!session.data.word) return this.customError('No word set. Use $gameNewHangman first.')

    const clean = letter.toLowerCase().replace(/[^a-z]/g, '')
    if (clean.length !== 1) return this.customError('Guess must be a single letter.')

    const guessed = new Set(session.data.guessed as string[])
    if (guessed.has(clean)) return this.customError(`Letter "${clean}" has already been guessed.`)

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')
    if (!session.players.has(userId))
      return this.customError('You are not in this game. Use $gameJoin first.')

    const word = String(session.data.word)
    const isInWord = word.includes(clean)
    guessed.add(clean)
    session.data.guessed = [...guessed]

    const player = session.players.get(userId)!
    if (!isInWord) {
      session.data.wrong = (session.data.wrong as number) + 1
      player.wrongAnswers += 1
    } else player.correctAnswers += 1

    const wrongCount = session.data.wrong as number
    const maxWrong = session.data.maxWrong as number
    const masked = Array.from(word).map((c) => (guessed.has(c) ? c : null))
    const won = masked.every((c) => c !== null)
    const lost = wrongCount >= maxWrong
    const pointsEarned = won ? Math.max(50, 300 - wrongCount * 50) : 0
    if (won) player.score += pointsEarned

    ctx.client
      .getExtension(ForgeGames, true)
      [
        'emitter'
      ].emit('gamesHangmanGuess', session.id, session.guildId, session.channelId, userId, clean, isInWord)

    return this.successJSON({
      letter: clean,
      correct: isInWord,
      wrongCount,
      maxWrong,
      masked,
      guessed: [...guessed],
      won,
      lost,
      correctWord: won || lost ? word : null,
      pointsEarned,
    })
  },
})
