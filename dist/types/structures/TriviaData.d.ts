export type TriviaCategory = 'general' | 'science' | 'history' | 'geography' | 'sports' | 'entertainment' | 'technology';
export interface TriviaQuestion {
    question: string;
    answer: string;
    choices: string[];
    category: TriviaCategory;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
}
export declare const TRIVIA_BANK: TriviaQuestion[];
export declare function getQuestion(opts: {
    category?: TriviaCategory;
    difficulty?: 'easy' | 'medium' | 'hard';
    exclude?: string[];
}): TriviaQuestion | null;
export declare function shuffleChoices(q: TriviaQuestion): string[];
