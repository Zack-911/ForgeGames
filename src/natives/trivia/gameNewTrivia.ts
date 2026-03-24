import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'
import { TriviaCategory, getQuestion, shuffleChoices } from '../../structures/TriviaData.js'

export default new NativeFunction({
  name: '$gameNewTrivia',
  description:
    'Loads a new trivia question into the session and returns it as JSON. Sets a per-question timeout.',
  version: '1.0.0',
  brackets: false,
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
      name: 'category',
      description:
        'Filter by category (general|science|history|geography|sports|entertainment|technology)',
      type: ArgType.String,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel, category]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')
    if (session.type !== 'trivia') return this.customError('This session is not a trivia game.')
    if (session.status !== 'active') return this.customError('The game has not started yet.')

    const asked = (session.data.asked as string[] | undefined) ?? []

    const q = getQuestion({
      category: category as TriviaCategory | undefined,
      difficulty: session.difficulty,
      exclude: asked,
    })

    if (!q)
      return this.customError(
        'No more questions available for this category/difficulty combination.',
      )

    const shuffled = shuffleChoices(q)
    asked.push(q.question)
    session.data.asked = asked
    session.data.question = q.question
    session.data.answer = q.answer
    session.data.choices = shuffled
    session.data.points = q.points
    session.data.category = q.category
    session.data.answered = false

    const ext = ctx.client.getExtension(ForgeGames, true)
    sessions.setTimeout(
      session,
      () => {
        if (session.status === 'active' && !session.data.answered) {
          ext['emitter'].emit('gamesAnswerTimeout', session.id, g.id, ch.id)
        }
      },
      session.timeoutMs,
    )

    return this.successJSON({
      question: q.question,
      choices: shuffled,
      category: q.category,
      points: q.points,
      answer: q.answer,
    })
  },
})
