export type GameType = 'trivia' | 'wordle' | 'math' | 'hangman' | 'scramble' | 'tictactoe' | 'rps';
export type GameStatus = 'waiting' | 'active' | 'ended';
export type GameDifficulty = 'easy' | 'medium' | 'hard';
export interface GamePlayer {
    userId: string;
    score: number;
    joinedAt: number;
    correctAnswers: number;
    wrongAnswers: number;
}
export interface GameSession {
    id: string;
    type: GameType;
    guildId: string;
    channelId: string;
    hostId: string;
    status: GameStatus;
    difficulty: GameDifficulty;
    players: Map<string, GamePlayer>;
    startedAt: number | null;
    endedAt: number | null;
    timeoutMs: number;
    timeoutHandle: ReturnType<typeof setTimeout> | null;
    maxPlayers: number;
    data: Record<string, unknown>;
}
declare class SessionManager {
    /** Primary store: UUID → session */
    private sessions;
    create(opts: {
        type: GameType;
        guildId: string;
        channelId: string;
        hostId: string;
        difficulty?: GameDifficulty;
        timeoutMs?: number;
        maxPlayers?: number;
        data?: Record<string, unknown>;
    }): GameSession;
    /** Look up by UUID — the standard lookup used by all game functions. */
    getById(id: string): GameSession | null;
    /** Destroy by UUID. */
    destroy(id: string): boolean;
    /** All sessions for a guild, optionally filtered by channel. */
    forGuild(guildId: string, channelId?: string): GameSession[];
    /** First active/waiting session in a channel (for $gameExists / $gameIsActive). */
    forChannel(guildId: string, channelId: string): GameSession | null;
    addPlayer(session: GameSession, userId: string): GamePlayer;
    removePlayer(session: GameSession, userId: string): boolean;
    leaderboard(session: GameSession): GamePlayer[];
    start(session: GameSession): void;
    end(session: GameSession): void;
    setTimeout(session: GameSession, callback: () => void, ms: number): void;
    clearTimeout(session: GameSession): void;
    get size(): number;
}
export declare const sessions: SessionManager;
export {};
