"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameWordleGuessCount',
    description: 'Returns JSON: { guessesUsed, guessesLeft, maxGuesses, history } with the full guess/tile history.',
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
        if (session.type !== 'wordle')
            return this.customError('This session is not a Wordle game.');
        const guesses = session.data.guesses ?? [];
        const results = session.data.results ?? [];
        const maxGuesses = session.data.maxGuesses ?? 6;
        return this.successJSON({
            guessesUsed: guesses.length,
            guessesLeft: maxGuesses - guesses.length,
            maxGuesses,
            history: guesses.map((g, i) => ({ guess: g, tileArray: results[i] ?? [] })),
        });
    },
});
//# sourceMappingURL=gameWordleGuessCount.js.map