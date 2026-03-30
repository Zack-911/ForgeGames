import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

const BEATS: Record<string, string> = { rock: 'scissors', scissors: 'paper', paper: 'rock' }
const EMOJI: Record<string, string> = { rock: '🪨', paper: '📄', scissors: '✂️' }

export default new NativeFunction({
  name: '$gameRpsChoice',
  description:
    'Submits a rock/paper/scissors choice. Returns JSON with result once both players have chosen.',
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
      name: 'choice',
      description: 'rock | paper | scissors',
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
  execute(ctx, [sessionID, choice, user]) {
    const session = sessions.getById(sessionID)
    if (!session) return this.customError('No game session found for the given ID.')
    if ((session.type as string) !== 'rps')
      return this.customError('This session is not an RPS game.')
    if (session.status !== 'active') return this.customError('The game is not active.')
    if (!session.data.challenger)
      return this.customError('RPS not initialised. Use $gameNewRps first.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')

    const pick = choice.toLowerCase().trim()
    if (!['rock', 'paper', 'scissors'].includes(pick))
      return this.customError(`Invalid choice "${pick}". Use: rock, paper, or scissors.`)

    const cId = String(session.data.challenger)
    const oId = String(session.data.opponent)
    if (userId !== cId && userId !== oId)
      return this.customError('You are not a player in this game.')

    if (userId === cId) {
      if (session.data.challengerChoice)
        return this.customError('You have already made your choice.')
      session.data.challengerChoice = pick
    } else {
      if (session.data.opponentChoice) return this.customError('You have already made your choice.')
      session.data.opponentChoice = pick
    }

    const cChoice = session.data.challengerChoice as string | null
    const oChoice = session.data.opponentChoice as string | null
    if (!cChoice || !oChoice) return this.successJSON({ waiting: true, chosen: pick })

    let winner: string | null = null,
      outcome = 'draw'
    if (BEATS[cChoice] === oChoice) {
      winner = cId
      outcome = 'win'
    } else if (BEATS[oChoice] === cChoice) {
      winner = oId === 'bot' ? 'bot' : oId
      outcome = 'lose'
    }

    if (winner && winner !== 'bot') {
      const p = session.players.get(winner)
      if (p) {
        p.score += 300
        p.correctAnswers += 1
      }
    }

    const ext = ctx.client.getExtension(ForgeGames, true)
    ext.events.emit(
      winner && winner !== 'bot' ? 'gamesAnswerCorrect' : 'gamesAnswerWrong',
      session.id,
      session.guildId,
      session.channelId,
      winner ?? cId,
      pick,
      300,
    )

    return this.successJSON({
      waiting: false,
      challengerChoice: cChoice,
      opponentChoice: oChoice,
      challengerEmoji: EMOJI[cChoice],
      opponentEmoji: EMOJI[oChoice],
      winner,
      outcome,
      isDraw: outcome === 'draw',
    })
  },
})
