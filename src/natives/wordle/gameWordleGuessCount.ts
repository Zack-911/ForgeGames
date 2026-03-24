import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameWordleGuessCount',
  description: 'Returns JSON with guesses used, guesses left, and the full guess+tile history.',
  version: '1.0.0',
  brackets: false,
  unwrap: true,
  args: [
    { name: 'guildID',   description: 'Guild of the session',   type: ArgType.Guild,   required: true, rest: false },
    { name: 'channelID', description: 'Channel of the session', type: ArgType.Channel, required: true, rest: false },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel]) {
    const g  = guild   ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session)                  return this.customError('No active game session found.')
    if (session.type !== 'wordle') return this.customError('This session is not a Wordle game.')

    const guesses    = (session.data.guesses as string[] | undefined) ?? []
    const results    = (session.data.results as string[][] | undefined) ?? []
    const maxGuesses = (session.data.maxGuesses as number | undefined) ?? 6

    // Calculate tried letters status (cumulative)
    const triedLetters: Record<string, string> = {}
    const STATUS_PRIORITY: Record<string, number> = { 'none': 0, 'absent': 1, 'present': 2, 'correct': 3 }

    guesses.forEach((g, idx) => {
      const res = results[idx]
      if (!res) return
      g.split('').forEach((char, i) => {
        const status = res[i]
        if (!status) return
        const currentBest = triedLetters[char] ?? 'none'
        if (STATUS_PRIORITY[status] > STATUS_PRIORITY[currentBest]) {
          triedLetters[char] = status
        }
      })
    })

    return this.successJSON({
      guessesUsed: guesses.length,
      guessesLeft: maxGuesses - guesses.length,
      maxGuesses,
      triedLetters,
      history: guesses.map((g, idx) => {
        const res = results[idx] ?? []
        return {
          guess: g,
          tileArray: res,
          correctLetters: g.split('').map((char, i) => ({
            character: char,
            position:  i,
            type:      res[i] === 'correct' ? 'full' : res[i] === 'present' ? 'partial' : 'none'
          }))
        }
      }),
    })
  },
})
