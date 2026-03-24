"use strict";
// ============================================================
//  Hangman word bank
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHangmanWord = getHangmanWord;
const HANGMAN_WORDS = {
    easy: [
        'cat',
        'dog',
        'sun',
        'cup',
        'hat',
        'map',
        'pen',
        'box',
        'key',
        'fly',
        'bus',
        'leg',
        'arm',
        'sea',
        'sky',
        'ice',
        'ear',
        'eye',
        'lip',
        'jaw',
    ],
    medium: [
        'planet',
        'castle',
        'jungle',
        'rocket',
        'dragon',
        'bridge',
        'river',
        'forest',
        'anchor',
        'guitar',
        'mirror',
        'basket',
        'butter',
        'candle',
        'dinner',
        'flower',
        'garden',
        'hidden',
        'island',
        'knight',
    ],
    hard: [
        'quantum',
        'eclipse',
        'polygon',
        'almanac',
        'chimney',
        'dolphin',
        'emperor',
        'fantasy',
        'gravity',
        'horizon',
        'integer',
        'lantern',
        'mineral',
        'obscure',
        'pilgrim',
        'radical',
        'silence',
        'symptom',
        'tourist',
        'uniform',
    ],
};
function getHangmanWord(difficulty) {
    const list = HANGMAN_WORDS[difficulty];
    return list[Math.floor(Math.random() * list.length)];
}
//# sourceMappingURL=HangmanData.js.map