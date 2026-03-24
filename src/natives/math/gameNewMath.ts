import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { sessions } from '../../structures/GameSession.js'

function generateMath(diff: string): { question: string; answer: number; points: number } {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

  if (diff === 'easy') {
    const a = rand(1, 20),
      b = rand(1, 20)
    const op = ['add', 'sub'][rand(0, 1)]
    if (op === 'add') return { question: `${a} + ${b}`, answer: a + b, points: 100 }
    return {
      question: `${Math.max(a, b)} - ${Math.min(a, b)}`,
      answer: Math.abs(a - b),
      points: 100,
    }
  }

  if (diff === 'hard') {
    const type = rand(0, 2)
    if (type === 0) {
      const a = rand(1, 10),
        b = rand(1, 10),
        c = rand(2, 9)
      return { question: `(${a} + ${b}) × ${c}`, answer: (a + b) * c, points: 400 }
    }
    if (type === 1) {
      const n = rand(11, 25)
      return { question: `${n}²`, answer: n * n, points: 400 }
    }
    const pct = [10, 20, 25, 50][rand(0, 3)]!
    const num = rand(1, 20) * 4
    return { question: `${pct}% of ${num}`, answer: Math.round((num * pct) / 100), points: 400 }
  }

  // medium
  const type = rand(0, 2)
  if (type === 0) {
    const a = rand(2, 12),
      b = rand(2, 12)
    return { question: `${a} × ${b}`, answer: a * b, points: 200 }
  }
  if (type === 1) {
    const b = rand(2, 9),
      a = b * rand(2, 12)
    return { question: `${a} ÷ ${b}`, answer: a / b, points: 200 }
  }
  const a = rand(10, 99),
    b = rand(10, 99)
  return { question: `${a} + ${b}`, answer: a + b, points: 200 }
}

export default new NativeFunction({
  name: '$gameNewMath',
  description: 'Generates a new math question for the session and returns it as JSON.',
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
  ],
  output: ArgType.Json,
  execute(ctx, [guild, channel]) {
    const g = guild ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')
    if (session.type !== 'math') return this.customError('This session is not a math game.')
    if (session.status !== 'active') return this.customError('The game has not started yet.')

    const q = generateMath(session.difficulty)
    session.data.question = q.question
    session.data.answer = q.answer
    session.data.points = q.points
    session.data.answered = false

    return this.successJSON({ question: q.question, points: q.points })
  },
})
