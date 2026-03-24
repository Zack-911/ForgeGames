import { BaseCommandManager, BaseEventHandler, ForgeClient } from '@tryforge/forgescript';
export interface IForgeGamesEvents {
    gamesSessionCreate: [
        sessionId: string,
        type: string,
        guildId: string,
        channelId: string,
        hostId: string
    ];
    gamesSessionStart: [sessionId: string, type: string, guildId: string, channelId: string];
    gamesSessionEnd: [
        sessionId: string,
        type: string,
        guildId: string,
        channelId: string,
        winnerId: string | null
    ];
    gamesSessionTimeout: [sessionId: string, type: string, guildId: string, channelId: string];
    gamesPlayerJoin: [sessionId: string, guildId: string, channelId: string, userId: string];
    gamesPlayerLeave: [sessionId: string, guildId: string, channelId: string, userId: string];
    gamesAnswerCorrect: [
        sessionId: string,
        guildId: string,
        channelId: string,
        userId: string,
        answer: string,
        points: number
    ];
    gamesAnswerWrong: [
        sessionId: string,
        guildId: string,
        channelId: string,
        userId: string,
        answer: string
    ];
    gamesAnswerTimeout: [sessionId: string, guildId: string, channelId: string];
    gamesWordleGuess: [
        sessionId: string,
        guildId: string,
        channelId: string,
        userId: string,
        guess: string,
        result: string
    ];
    gamesHangmanGuess: [
        sessionId: string,
        guildId: string,
        channelId: string,
        userId: string,
        letter: string,
        correct: boolean
    ];
    gamesScrambleAnswer: [
        sessionId: string,
        guildId: string,
        channelId: string,
        userId: string,
        answer: string,
        correct: boolean
    ];
}
export declare class ForgeGamesCommandManager extends BaseCommandManager<keyof IForgeGamesEvents> {
    handlerName: string;
}
export declare class ForgeGamesEventHandler<T extends keyof IForgeGamesEvents> extends BaseEventHandler<IForgeGamesEvents, T> {
    register(client: ForgeClient): void;
}
