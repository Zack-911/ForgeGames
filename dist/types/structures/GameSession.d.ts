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
    /** Game-specific payload — trivia question, wordle word, etc. */
    data: Record<string, unknown>;
}
declare class SessionManager {
    private sessions;
    /** One active session per channel at most. Key = guildId:channelId */
    private channelKey;
    create(opts: {
        type: GameType;
        guildId: string;
        channelId: string;
        hostId: string;
        difficulty?: GameDifficulty;
        timeoutMs?: number;
        maxPlayers?: number;
        data?: Record<string, unknown>;
    }): GameSession | null;
    get(guildId: string, channelId: string): GameSession | null;
    getById(id: string): GameSession | null;
    destroy(guildId: string, channelId: string): boolean;
    /** Returns all sessions for a guild */
    forGuild(guildId: string): GameSession[];
    /** Adds or updates a player in a session */
    addPlayer(session: GameSession, userId: string): GamePlayer;
    removePlayer(session: GameSession, userId: string): boolean;
    /** Sorted leaderboard for a session */
    leaderboard(session: GameSession): GamePlayer[];
    start(session: GameSession): void;
    end(session: GameSession): void;
    /** Schedule auto-end. Returns old timeout handle for cancellation. */
    setTimeout(session: GameSession, callback: () => void, ms: number): void;
    clearTimeout(session: GameSession): void;
    /** Total sessions currently alive */
    get size(): number;
}
export declare const sessions: SessionManager;
export {};
