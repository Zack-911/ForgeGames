import { ForgeClient, ForgeExtension } from '@tryforge/forgescript';
import { TypedEmitter } from 'tiny-typed-emitter';
import { ForgeGamesCommandManager, IForgeGamesEvents } from './structures/ForgeGamesEventManager.js';
type TransformEvents<T> = {
    [P in keyof T]: T[P] extends unknown[] ? (...args: T[P]) => void : never;
};
export interface ForgeGamesOptions {
    /** Specific event names to register command listeners for. Defaults to all. */
    events?: Array<keyof IForgeGamesEvents>;
}
export declare class ForgeGames extends ForgeExtension {
    private readonly options;
    name: string;
    description: string;
    version: string;
    client: ForgeClient;
    commands: ForgeGamesCommandManager;
    readonly events: TypedEmitter<TransformEvents<IForgeGamesEvents>>;
    constructor(options?: ForgeGamesOptions);
    init(client: ForgeClient): Promise<void>;
}
export { sessions } from './structures/GameSession.js';
export type { GameSession, GameType, GameDifficulty, GamePlayer, GameStatus, } from './structures/GameSession.js';
export type { IForgeGamesEvents } from './structures/ForgeGamesEventManager.js';
