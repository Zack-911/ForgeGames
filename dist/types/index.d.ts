import { ForgeClient, ForgeExtension } from '@tryforge/forgescript';
import { ForgeGamesCommandManager, IForgeGamesEvents } from './structures/ForgeGamesEventManager.js';
export interface ForgeGamesOptions {
    /** Specific event names to register command listeners for. Defaults to all. */
    events?: Array<keyof IForgeGamesEvents>;
    /**
     * Optional callback fired when a session times out with no winner.
     * Useful for sending a "time's up" message without registering a full bot command.
     */
    onTimeout?: (sessionId: string, type: string, guildId: string, channelId: string) => void;
}
export declare class ForgeGames extends ForgeExtension {
    private readonly options;
    name: string;
    description: string;
    version: string;
    client: ForgeClient;
    commands: ForgeGamesCommandManager;
    private emitter;
    constructor(options?: ForgeGamesOptions);
    init(client: ForgeClient): Promise<void>;
}
export { sessions } from './structures/GameSession.js';
export type { GameSession, GameType, GameDifficulty, GamePlayer, GameStatus, } from './structures/GameSession.js';
export type { IForgeGamesEvents } from './structures/ForgeGamesEventManager.js';
