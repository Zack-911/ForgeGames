"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
const WordData_js_1 = require("../../structures/WordData.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameNewScramble',
    description: 'Generates a scrambled word. Returns JSON: { scrambled, wordLength, points, difficulty }.',
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
        if (session.type !== 'scramble')
            return this.customError('This session is not a Scramble game.');
        if (session.status !== 'active')
            return this.customError('The game has not started yet.');
        const word = (0, WordData_js_1.getWord)(session.difficulty);
        const scrambled = (0, WordData_js_1.scramble)(word);
        const points = session.difficulty === 'easy' ? 100 : session.difficulty === 'hard' ? 400 : 200;
        session.data.word = word;
        session.data.scrambled = scrambled;
        session.data.points = points;
        session.data.answered = false;
        return this.successJSON({
            scrambled,
            wordLength: word.length,
            points,
            difficulty: session.difficulty,
        });
    },
});
//# sourceMappingURL=gameNewScramble.js.map