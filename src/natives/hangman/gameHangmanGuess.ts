import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameHangmanGuess',
  description: [
    'Guesses a single letter in Hangman.',
    'Returns JSON: { letter, correct, wrongCount, maxWrong, masked, guessed, won, lost, correctWord }.',
    'masked is an array e.g. ["h",null,"n","g","m","a","n"] — null for unguessed letters.',
    'correctWord is only revealed on win or loss.',
  ].join(' '),
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'guildID',
      description: 'Guild of the session',
      type: ArgType.Guild,
      required: true,
      rest: false,
    },
    {
      name: 'channelID',
      description: 'Channel of the session',
      type: ArgType.Channel,
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
  execute(ctx, [guild, channel, letter, user]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')
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
    } else {
      player.correctAnswers += 1
    }

    const wrongCount = session.data.wrong as number
    const maxWrong = session.data.maxWrong as number

    // masked: array of revealed chars or null for unguessed
    const masked = Array.from(word).map((c) => (guessed.has(c) ? c : null))
    const won = masked.every((c) => c !== null)
    const lost = wrongCount >= maxWrong

    if (won) {
      const bonus = Math.max(50, 300 - wrongCount * 50)
      player.score += bonus
    }

    const ext = ctx.client.getExtension(ForgeGames, true)
    ext['emitter'].emit('gamesHangmanGuess', session.id, g.id, ch.id, userId, clean, isInWord)

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
      pointsEarned: won ? Math.max(50, 300 - wrongCount * 50) : 0,
    })
  },
})
