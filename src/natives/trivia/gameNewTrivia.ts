import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'
import { TriviaCategory, getQuestion, shuffleChoices } from '../../structures/TriviaData.js'

export default new NativeFunction({
  name: '$gameNewTrivia',
  description:
    'Loads a new trivia question into the session. Returns JSON: { question, choices, category, points }.',
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
  execute(ctx, [sessionID, category]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
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
          ext.events.emit('gamesAnswerTimeout', session)
        }
      },
      session.timeoutMs,
    )

    return this.successJSON({
      question: q.question,
      choices: shuffled,
      category: q.category,
      points: q.points,
    })
  },
})
