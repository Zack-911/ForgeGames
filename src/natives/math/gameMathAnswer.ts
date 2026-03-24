import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameMathAnswer',
  description: [
    'Submits a numeric answer to the current math question.',
    'Returns JSON: { correct, answer, correctAnswer, pointsEarned, score }.',
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
      name: 'answer',
      description: 'The numeric answer',
      type: ArgType.Number,
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
  execute(ctx, [guild, channel, answer, user]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')
    if (session.type !== 'math') return this.customError('This session is not a math game.')
    if (session.status !== 'active') return this.customError('The game is not active.')
    if (!session.data.question)
      return this.customError('No question loaded. Use $gameNewMath first.')
    if (session.data.answered) return this.customError('Question already answered.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')
    if (!session.players.has(userId))
      return this.customError('You are not in this game. Use $gameJoin first.')

    const correctAnswer = Number(session.data.answer)
    const isCorrect = Math.round(answer) === correctAnswer

    const player = session.players.get(userId)!
    const ext = ctx.client.getExtension(ForgeGames, true)
    const points = Number(session.data.points ?? 200)

    if (isCorrect) {
      player.score += points
      player.correctAnswers += 1
      session.data.answered = true
      sessions.clearTimeout(session)
      ext['emitter'].emit(
        'gamesAnswerCorrect',
        session.id,
        g.id,
        ch.id,
        userId,
        String(answer),
        points,
      )
    } else {
      player.wrongAnswers += 1
      ext['emitter'].emit('gamesAnswerWrong', session.id, g.id, ch.id, userId, String(answer))
    }

    return this.successJSON({
      correct: isCorrect,
      answer,
      correctAnswer: isCorrect ? correctAnswer : null,
      pointsEarned: isCorrect ? points : 0,
      score: player.score,
    })
  },
})
