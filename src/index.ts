import { EventManager, ForgeClient, ForgeExtension, Logger } from '@tryforge/forgescript'
import path from 'path'
import { TypedEmitter } from 'tiny-typed-emitter'

import { ForgeGamesCommandManager, IForgeGamesEvents } from './structures/ForgeGamesEventManager.js'

type TransformEvents<T> = {
  [P in keyof T]: T[P] extends unknown[] ? (...args: T[P]) => void : never
}

export interface ForgeGamesOptions {
  events: Array<keyof IForgeGamesEvents>
}

export class ForgeGames extends ForgeExtension {
  name = 'ForgeGames'
  description =
    'Interactive games extension for ForgeScript — Trivia, Wordle, Hangman, Math Blitz, Scramble, Tic-Tac-Toe, RPS'
  version = '1.0.0'

  public client!: ForgeClient
  public commands!: ForgeGamesCommandManager

  public readonly events = new TypedEmitter<TransformEvents<IForgeGamesEvents>>()

  constructor(private readonly options: ForgeGamesOptions) {
    super()
  }

  async init(client: ForgeClient) {
    const start = Date.now()
    this.client = client
    this.commands = new ForgeGamesCommandManager(client)

    this.load(path.join(__dirname, './natives'))

    EventManager.load('ForgeGames', path.join(__dirname, '/events'))

    const eventsToLoad = this.options.events
    if (eventsToLoad.length) {
      this.client.events.load('ForgeGames', eventsToLoad)
    }

    this.events.on('error' as any, (err: Error) => {
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
