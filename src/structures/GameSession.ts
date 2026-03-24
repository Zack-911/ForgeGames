export type GameType = 'trivia' | 'wordle' | 'math' | 'hangman' | 'scramble' | 'tictactoe' | 'rps'
export type GameStatus = 'waiting' | 'active' | 'ended'
export type GameDifficulty = 'easy' | 'medium' | 'hard'

export interface GamePlayer {
  userId: string
  score: number
  joinedAt: number
  correctAnswers: number
  wrongAnswers: number
}

export interface GameSession {
  id: string
  type: GameType
  guildId: string
  channelId: string
  hostId: string
  status: GameStatus
  difficulty: GameDifficulty
  players: Map<string, GamePlayer>
  startedAt: number | null
  endedAt: number | null
  timeoutMs: number
  timeoutHandle: ReturnType<typeof setTimeout> | null
  maxPlayers: number
  /** Game-specific payload — trivia question, wordle word, etc. */
  data: Record<string, unknown>
}

// ============================================================
//  SessionManager — singleton that owns all game sessions
// ============================================================

class SessionManager {
  private sessions = new Map<string, GameSession>()

  /** One active session per channel at most. Key = guildId:channelId */
  private channelKey(guildId: string, channelId: string) {
    return `${guildId}:${channelId}`
  }

  create(opts: {
    type: GameType
    guildId: string
    channelId: string
    hostId: string
    difficulty?: GameDifficulty
    timeoutMs?: number
    maxPlayers?: number
    data?: Record<string, unknown>
  }): GameSession | null {
    const key = this.channelKey(opts.guildId, opts.channelId)
    if (this.sessions.has(key)) return null // already a game here

    const session: GameSession = {
      id: key,
      type: opts.type,
      guildId: opts.guildId,
      channelId: opts.channelId,
      hostId: opts.hostId,
      status: 'waiting',
      difficulty: opts.difficulty ?? 'medium',
      players: new Map(),
      startedAt: null,
      endedAt: null,
      timeoutMs: opts.timeoutMs ?? 30_000,
      timeoutHandle: null,
      maxPlayers: opts.maxPlayers ?? 10,
      data: opts.data ?? {},
    }

    this.sessions.set(key, session)
    return session
  }

  get(guildId: string, channelId: string): GameSession | null {
    return this.sessions.get(this.channelKey(guildId, channelId)) ?? null
  }

  getById(id: string): GameSession | null {
    return this.sessions.get(id) ?? null
  }

  destroy(guildId: string, channelId: string): boolean {
    const key = this.channelKey(guildId, channelId)
    const session = this.sessions.get(key)
    if (!session) return false
    if (session.timeoutHandle) clearTimeout(session.timeoutHandle)
    this.sessions.delete(key)
    return true
  }

  /** Returns all sessions for a guild */
  forGuild(guildId: string): GameSession[] {
    return [...this.sessions.values()].filter((s) => s.guildId === guildId)
  }

  /** Adds or updates a player in a session */
  addPlayer(session: GameSession, userId: string): GamePlayer {
    if (!session.players.has(userId)) {
      session.players.set(userId, {
        userId,
        score: 0,
        joinedAt: Date.now(),
        correctAnswers: 0,
        wrongAnswers: 0,
      })
    }
    return session.players.get(userId)!
  }

  removePlayer(session: GameSession, userId: string): boolean {
    return session.players.delete(userId)
  }

  /** Sorted leaderboard for a session */
  leaderboard(session: GameSession): GamePlayer[] {
    return [...session.players.values()].sort((a, b) => b.score - a.score)
  }

  start(session: GameSession): void {
    session.status = 'active'
    session.startedAt = Date.now()
  }

  end(session: GameSession): void {
    session.status = 'ended'
    session.endedAt = Date.now()
    if (session.timeoutHandle) {
      clearTimeout(session.timeoutHandle)
      session.timeoutHandle = null
    }
  }

  /** Schedule auto-end. Returns old timeout handle for cancellation. */
  setTimeout(session: GameSession, callback: () => void, ms: number): void {
    if (session.timeoutHandle) clearTimeout(session.timeoutHandle)
    session.timeoutHandle = setTimeout(callback, ms)
  }

  clearTimeout(session: GameSession): void {
    if (session.timeoutHandle) {
      clearTimeout(session.timeoutHandle)
      session.timeoutHandle = null
    }
  }

  /** Total sessions currently alive */
  get size() {
    return this.sessions.size
  }
}

export const sessions = new SessionManager()
