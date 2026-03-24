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
  id: string // UUID — the primary key, returned by $gameCreate
  type: GameType
  guildId: string // stored for querying / events, NOT used as lookup key
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
  data: Record<string, unknown>
}

// ─── tiny UUID generator (no external deps) ─────────────────────────────────
function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

// ─── SessionManager ──────────────────────────────────────────────────────────
class SessionManager {
  /** Primary store: UUID → session */
  private sessions = new Map<string, GameSession>()

  // ── CRUD ──────────────────────────────────────────────────────────────────

  create(opts: {
    type: GameType
    guildId: string
    channelId: string
    hostId: string
    difficulty?: GameDifficulty
    timeoutMs?: number
    maxPlayers?: number
    data?: Record<string, unknown>
  }): GameSession {
    const session: GameSession = {
      id: uuid(),
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

    this.sessions.set(session.id, session)
    return session
  }

  /** Look up by UUID — the standard lookup used by all game functions. */
  getById(id: string): GameSession | null {
    return this.sessions.get(id) ?? null
  }

  /** Destroy by UUID. */
  destroy(id: string): boolean {
    const session = this.sessions.get(id)
    if (!session) return false
    if (session.timeoutHandle) clearTimeout(session.timeoutHandle)
    this.sessions.delete(id)
    return true
  }

  // ── Query helpers ─────────────────────────────────────────────────────────

  /** All sessions for a guild, optionally filtered by channel. */
  forGuild(guildId: string, channelId?: string): GameSession[] {
    return [...this.sessions.values()].filter(
      (s) => s.guildId === guildId && (channelId === undefined || s.channelId === channelId),
    )
  }

  /** First active/waiting session in a channel (for $gameExists / $gameIsActive). */
  forChannel(guildId: string, channelId: string): GameSession | null {
    return (
      [...this.sessions.values()].find((s) => s.guildId === guildId && s.channelId === channelId) ??
      null
    )
  }

  // ── Player management ─────────────────────────────────────────────────────

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

  leaderboard(session: GameSession): GamePlayer[] {
    return [...session.players.values()].sort((a, b) => b.score - a.score)
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

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

  get size() {
    return this.sessions.size
  }
}

export const sessions = new SessionManager()
