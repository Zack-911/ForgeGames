import { ArgType, NativeFunction } from '@tryforge/forgescript'

import { ForgeGames } from '../../index.js'
import { GameDifficulty, GameType, sessions } from '../../structures/GameSession.js'

export default new NativeFunction({
  name: '$gameCreate',
  description:
    'Creates a new game session in the given channel. Returns the session ID or an error if one already exists.',
  version: '1.0.0',
  brackets: true,
  unwrap: true,
  args: [
    {
      name: 'type',
      description: 'Game type: trivia | wordle | math | hangman | scramble | tictactoe | rps',
      type: ArgType.String,
      required: true,
      rest: false,
    },
    {
      name: 'guildID',
      description: 'Guild to create the session in',
      type: ArgType.Guild,
      required: true,
      rest: false,
    },
    {
      name: 'channelID',
      description: 'Channel to create the session in',
      type: ArgType.Channel,
      required: true,
      rest: false,
    },
    {
      name: 'difficulty',
      description: 'Difficulty: easy | medium | hard (default: medium)',
      type: ArgType.String,
      required: false,
      rest: false,
    },
    {
      name: 'timeoutSeconds',
      description: 'Seconds before auto-expire (default: 30)',
      type: ArgType.Number,
      required: false,
      rest: false,
    },
    {
      name: 'maxPlayers',
      description: 'Max players allowed (default: 10)',
      type: ArgType.Number,
      required: false,
      rest: false,
    },
  ],
  output: ArgType.String,
  execute(ctx, [type, guild, channel, difficulty, timeoutSeconds, maxPlayers]) {
    const validTypes: GameType[] = [
      'trivia', 'wordle', 'math', 'hangman', 'scramble', 'tictactoe', 'rps',
    ]
    const validDiffs: GameDifficulty[] = ['easy', 'medium', 'hard']

    if (!validTypes.includes(type as GameType))
      return this.customError(`Invalid type "${type}". Choose: ${validTypes.join(', ')}`)

    const diff = (difficulty ?? 'medium') as GameDifficulty
    if (!validDiffs.includes(diff))
      return this.customError(`Invalid difficulty "${difficulty}". Choose: easy, medium, hard`)

    const g  = guild   ?? ctx.guild
    const ch = channel ?? ctx.channel
    if (!g)  return this.customError('No guild found.')
    if (!ch) return this.customError('No channel found.')

    const hostId = ctx.user?.id ?? ctx.member?.id
    if (!hostId) return this.customError('Could not determine the host user.')

    const timeoutMs = Math.max(5_000, Math.min(300_000, (timeoutSeconds ?? 30) * 1000))
    const max       = Math.max(1, Math.min(50, maxPlayers ?? 10))

    const session = sessions.create({
      type: type as GameType,
      guildId:   g.id,
      channelId: ch.id,
      hostId,
      difficulty: diff,
      timeoutMs,
      maxPlayers: max,
    })

    if (!session)
      return this.customError('A game is already running in this channel. Use $gameEnd first.')

    ctx.client
      .getExtension(ForgeGames, true)
      ['emitter'].emit('gamesSessionCreate', session.id, session.type, g.id, ch.id, hostId)

    return this.success(session.id)
  },
})
