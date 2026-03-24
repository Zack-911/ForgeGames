import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameTriviaAnswer',
  description: [
    'Submits an answer to the current trivia question.',
    'Returns JSON: { correct, answer, correctAnswer, pointsEarned, score }.',
  ].join(' '),
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    { name: 'guildID',   description: 'Guild of the session',   type: ArgType.Guild,   required: true,  rest: false },
    { name: 'channelID', description: 'Channel of the session', type: ArgType.Channel, required: true,  rest: false },
    { name: 'answer',    description: "The player's answer",   type: ArgType.String,  required: true,  rest: false },
    { name: 'userID',    description: 'Override user ID',       type: ArgType.User,    required: false, rest: false },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel, answer, user]) {
    const g  = guild   ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session)                    return this.customError('No active game session found.')
    if (session.type !== 'trivia')   return this.customError('This session is not a trivia game.')
    if (session.status !== 'active') return this.customError('The game is not currently active.')
    if (!session.data.question)      return this.customError('No question has been loaded. Use $gameNewTrivia first.')
    if (session.data.answered)       return this.customError('This question has already been answered.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId)                      return this.customError('Could not determine user.')
    if (!session.players.has(userId)) return this.customError('You are not in this game. Use $gameJoin first.')

    const normalise  = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
    const correct    = normalise(String(session.data.answer))
    const given      = normalise(answer)
    const isCorrect  = given === correct || correct.startsWith(given)

    const player     = session.players.get(userId)!
    const ext        = ctx.client.getExtension(ForgeGames, true)
    const points     = Number(session.data.points ?? 100)

    if (isCorrect) {
      player.score          += points
      player.correctAnswers += 1
      session.data.answered  = true
      sessions.clearTimeout(session)
      ext['emitter'].emit('gamesAnswerCorrect', session.id, g.id, ch.id, userId, answer, points)
    } else {
      player.wrongAnswers += 1
      ext['emitter'].emit('gamesAnswerWrong', session.id, g.id, ch.id, userId, answer)
    }

    return this.successJSON({
      correct:       isCorrect,
      answer,
      correctAnswer: isCorrect ? String(session.data.answer) : null,
      pointsEarned:  isCorrect ? points : 0,
      score:         player.score,
    })
  },
})
