import { EventManager, ForgeClient, ForgeExtension, Logger } from '@tryforge/forgescript'
import path from 'path'
import { TypedEmitter } from 'tiny-typed-emitter'

import { ForgeGamesCommandManager, IForgeGamesEvents } from './structures/ForgeGamesEventManager.js'

type TransformEvents<T> = {
  [P in keyof T]: T[P] extends unknown[] ? (...args: T[P]) => void : never
}

export interface ForgeGamesOptions {
  /** Specific event names to register command listeners for. Defaults to all. */
  events?: Array<keyof IForgeGamesEvents>
  /**
   * Optional callback fired when a session times out with no winner.
   * Useful for sending a "time's up" message without registering a full bot command.
   */
  onTimeout?: (sessionId: string, type: string, guildId: string, channelId: string) => void
}

export class ForgeGames extends ForgeExtension {
  name = 'ForgeGames'
  description =
    'Interactive games extension for ForgeScript — Trivia, Wordle, Hangman, Math Blitz, Scramble, Tic-Tac-Toe, RPS'
  version = '1.0.0'

  public client!: ForgeClient
  public commands!: ForgeGamesCommandManager

  private emitter = new TypedEmitter<TransformEvents<IForgeGamesEvents>>()

  constructor(private readonly options: ForgeGamesOptions = {}) {
    super()
  }

  async init(client: ForgeClient) {
    const start = Date.now()
    this.client = client
    this.commands = new ForgeGamesCommandManager(client)

    this.load(path.join(__dirname, './natives'))

    EventManager.load('ForgeGames', path.join(__dirname, '/events'))

    // Subscribe to events (all by default)
    const allEvents: Array<keyof IForgeGamesEvents> = [
      'gamesSessionCreate',
      'gamesSessionStart',
      'gamesSessionEnd',
      'gamesSessionTimeout',
      'gamesPlayerJoin',
      'gamesPlayerLeave',
      'gamesAnswerCorrect',
      'gamesAnswerWrong',
      'gamesAnswerTimeout',
      'gamesWordleGuess',
      'gamesHangmanGuess',
      'gamesScrambleAnswer',
    ]
    const eventsToLoad = this.options.events ?? allEvents
    if (eventsToLoad.length) {
      this.client.events.load('ForgeGames', eventsToLoad)
    }

    if (this.options.onTimeout) {
      this.emitter.on('gamesSessionTimeout', this.options.onTimeout)
    }

    this.emitter.on('error' as any, (err: Error) => {
      Logger.error('[ForgeGames] Unhandled emitter error:', err)
    })

    Logger.info(`[ForgeGames] Initialized in ${Date.now() - start}ms`)
  }
}

export { sessions } from './structures/GameSession.js'
export type {
  GameSession,
  GameType,
  GameDifficulty,
  GamePlayer,
  GameStatus,
} from './structures/GameSession.js'
export type { IForgeGamesEvents } from './structures/ForgeGamesEventManager.js'
