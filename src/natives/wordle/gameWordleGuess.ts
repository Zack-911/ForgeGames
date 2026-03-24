import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'
import { wordleResult } from '../../structures/WordData.js'

export default new NativeFunction({
  name: '$gameWordleGuess',
  description:
    'Submits a 5-letter Wordle guess. Returns JSON: { guess, tiles, tileArray, guessNumber, guessesLeft, maxGuesses, won, lost, correctWord, pointsEarned }.',
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
      name: 'guess',
      description: 'A 5-letter word',
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
  execute(ctx, [sessionID, guess, user]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
    if (session.type !== 'wordle') return this.customError('This session is not a Wordle game.')
    if (session.status !== 'active') return this.customError('The game is not active.')
    if (!session.data.word) return this.customError('No word set. Use $gameNewWordle first.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')
    if (!session.players.has(userId))
      return this.customError('You are not in this game. Use $gameJoin first.')

    const clean = guess.toLowerCase().replace(/[^a-z]/g, '')
    if (clean.length !== 5) return this.customError('Guess must be exactly 5 letters.')

    const guesses = session.data.guesses as string[]
    const maxGuesses = session.data.maxGuesses as number
    if (guesses.length >= maxGuesses) return this.customError('No guesses remaining.')

    const secret = String(session.data.word)
    const tiles = wordleResult(secret, clean)
    const TILE_MAP: Record<string, string> = { '🟩': 'correct', '🟨': 'present', '⬛': 'absent' }
    const tileArray = tiles.split('').map((e) => TILE_MAP[e] ?? 'absent')

    guesses.push(clean)
    const results = (session.data.results as string[][]) ?? []
    results.push(tileArray)
    session.data.guesses = guesses
    session.data.results = results

    const player = session.players.get(userId)!
    const won = clean === secret
    const lost = !won && guesses.length >= maxGuesses

    const pointsEarned = won ? Math.max(100, 600 - (guesses.length - 1) * 100) : 0
    if (won) {
      player.score += pointsEarned
      player.correctAnswers += 1
    } else player.wrongAnswers += 1

    ctx.client
      .getExtension(ForgeGames, true)
      [
        'emitter'
      ].emit('gamesWordleGuess', session.id, session.guildId, session.channelId, userId, clean, tiles)

    return this.successJSON({
      guess,
      tiles,
      tileArray,
      guessNumber: guesses.length,
      guessesLeft: maxGuesses - guesses.length,
      maxGuesses,
      won,
      lost,
      correctWord: won || lost ? secret : null,
      pointsEarned,
    })
  },
})
