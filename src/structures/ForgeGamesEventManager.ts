import { BaseCommandManager, BaseEventHandler, ForgeClient } from '@tryforge/forgescript'

import { ForgeGames } from '../index.js'
import { GameSession } from './GameSession.js'

// ============================================================
//  All events the ForgeGames extension can emit
// ============================================================

export interface IForgeGamesEvents {
  // Session lifecycle
  gamesSessionCreate: [
    sessionId: string,
    type: string,
    guildId: string,
    channelId: string,
    hostId: string,
  ]
  gamesSessionStart: [sessionId: string, type: string, guildId: string, channelId: string]
  gamesSessionEnd: [
    sessionId: string,
    type: string,
    guildId: string,
    channelId: string,
    winnerId: string | null,
  ]
  gamesSessionTimeout: [session: GameSession]

  // Player lifecycle
  gamesPlayerJoin: [sessionId: string, guildId: string, channelId: string, userId: string]
  gamesPlayerLeave: [sessionId: string, guildId: string, channelId: string, userId: string]

  // Answer events
  gamesAnswerCorrect: [
    sessionId: string,
    guildId: string,
    channelId: string,
    userId: string,
    answer: string,
    points: number,
  ]
  gamesAnswerWrong: [
    sessionId: string,
    guildId: string,
    channelId: string,
    userId: string,
    answer: string,
  ]
  gamesAnswerTimeout: [session: GameSession]

  // Game-specific
  gamesWordleGuess: [
    sessionId: string,
    guildId: string,
    channelId: string,
    userId: string,
    guess: string,
    result: string,
  ]
  gamesHangmanGuess: [
    sessionId: string,
    guildId: string,
    channelId: string,
    userId: string,
    letter: string,
    correct: boolean,
  ]
  gamesScrambleAnswer: [
    sessionId: string,
    guildId: string,
    channelId: string,
    userId: string,
    answer: string,
    correct: boolean,
  ]
}

// ============================================================
//  Command manager — stores bot commands keyed by event name
// ============================================================

export class ForgeGamesCommandManager extends BaseCommandManager<keyof IForgeGamesEvents> {
  handlerName = 'ForgeGames'
}

// ============================================================
//  Event handler base — hooks into the extension's emitter
// ============================================================

export class ForgeGamesEventHandler<T extends keyof IForgeGamesEvents> extends BaseEventHandler<
  IForgeGamesEvents,
  T
> {
  register(client: ForgeClient): void {
    client.getExtension(ForgeGames, true).events.on(this.name, this.listener.bind(client) as any)
  }
}
