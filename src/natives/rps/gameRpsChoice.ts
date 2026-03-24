import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { sessions } from '../../structures/GameSession.js'

const BEATS: Record<string, string> = { rock: 'scissors', scissors: 'paper', paper: 'rock' }
const EMOJI: Record<string, string> = { rock: '🪨', paper: '📄', scissors: '✂️' }

export default new NativeFunction({
  name: '$gameRpsChoice',
  description:
    'Submits a rock/paper/scissors choice. When both players have chosen, returns a result JSON.',
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
  execute(ctx, [guild, channel, choice, user]) {
    const g  = guild   ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g || !ch) return this.customError('No guild or channel found.')

    const session = sessions.get(g.id, ch.id)
    if (!session) return this.customError('No active game session found.')
    if ((session.type as string) !== 'rps')
      return this.customError('This session is not an RPS game.')
    if (session.status !== 'active') return this.customError('The game is not active.')
    if (!session.data.challenger)
      return this.customError('RPS not initialised. Use $gameNewRps first.')

    const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id
    if (!userId) return this.customError('Could not determine user.')

    const valid = ['rock', 'paper', 'scissors']
    const pick  = choice.toLowerCase().trim()
    if (!valid.includes(pick))
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
      if (session.data.opponentChoice)
        return this.customError('You have already made your choice.')
      session.data.opponentChoice = pick
    }

    const cChoice = session.data.challengerChoice as string | null
    const oChoice = session.data.opponentChoice  as string | null

    if (!cChoice || !oChoice) {
      return this.successJSON({ waiting: true, chosen: pick })
    }

    let winner: string | null = null
    let outcome = 'draw'
    if (BEATS[cChoice] === oChoice)      { winner = cId;                        outcome = 'win'  }
    else if (BEATS[oChoice] === cChoice) { winner = oId === 'bot' ? 'bot' : oId; outcome = 'lose' }

    if (winner && winner !== 'bot') {
      const player = session.players.get(winner)
      if (player) { player.score += 300; player.correctAnswers += 1 }
    }

    const ext = ctx.client.getExtension(ForgeGames, true)
    ext['emitter'].emit(
      winner && winner !== 'bot' ? 'gamesAnswerCorrect' : 'gamesAnswerWrong',
      session.id, g.id, ch.id, winner ?? cId, pick, 300,
    )

    return this.successJSON({
      waiting:          false,
      challengerChoice: cChoice,
      opponentChoice:   oChoice,
      challengerEmoji:  EMOJI[cChoice],
      opponentEmoji:    EMOJI[oChoice],
      winner,
      outcome,
      isDraw:           outcome === 'draw',
    })
  },
})
