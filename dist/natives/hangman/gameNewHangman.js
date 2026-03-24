"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
const HangmanData_js_1 = require("../../structures/HangmanData.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameNewHangman',
    description: 'Starts a Hangman round. Returns JSON: { wordLength, maxWrong, masked, guessed, wrongCount }.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'sessionID',
            description: 'Session UUID returned by $gameCreate',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(_ctx, [sessionID]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        if (session.type !== 'hangman')
            return this.customError('This session is not a Hangman game.');
        if (session.status !== 'active')
            return this.customError('The game has not started yet.');
        const word = (0, HangmanData_js_1.getHangmanWord)(session.difficulty);
        session.data.word = word;
        session.data.guessed = [];
        session.data.wrong = 0;
        session.data.maxWrong = 6;
        return this.successJSON({
            wordLength: word.length,
            maxWrong: 6,
            masked: Array.from(word).map(() => null),
            guessed: [],
            wrongCount: 0,
        });
    },
});
//# sourceMappingURL=gameNewHangman.js.map