export type WordDifficulty = 'easy' | 'medium' | 'hard';
export declare function getWord(difficulty: WordDifficulty): string;
export declare function scramble(word: string): string;
/** Returns emoji tiles for a Wordle guess */
export declare function wordleResult(secret: string, guess: string): string;
