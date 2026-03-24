import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'
import { getHangmanWord } from '../../structures/HangmanData.js'

export default new NativeFunction({
  name: '$gameNewHangman',
  description: [
    'Starts a Hangman round.',
    'Returns JSON: { wordLength, maxWrong, masked, guessed, wrongCount }.',
    'masked is an array of revealed letters and nulls e.g. [null,"a",null,null].',
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
