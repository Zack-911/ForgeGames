"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
function generateMath(diff) {
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    if (diff === 'easy') {
        const a = rand(1, 20), b = rand(1, 20);
        return ['add', 'sub'][rand(0, 1)] === 'add'
            ? { question: `${a} + ${b}`, answer: a + b, points: 100 }
            : { question: `${Math.max(a, b)} - ${Math.min(a, b)}`, answer: Math.abs(a - b), points: 100 };
    }
    if (diff === 'hard') {
        const t = rand(0, 2);
        if (t === 0) {
            const a = rand(1, 10), b = rand(1, 10), c = rand(2, 9);
            return { question: `(${a} + ${b}) × ${c}`, answer: (a + b) * c, points: 400 };
        }
        if (t === 1) {
            const n = rand(11, 25);
            return { question: `${n}²`, answer: n * n, points: 400 };
        }
        const pct = [10, 20, 25, 50][rand(0, 3)], num = rand(1, 20) * 4;
        return { question: `${pct}% of ${num}`, answer: Math.round((num * pct) / 100), points: 400 };
    }
    const t = rand(0, 2);
    if (t === 0) {
        const a = rand(2, 12), b = rand(2, 12);
        return { question: `${a} × ${b}`, answer: a * b, points: 200 };
    }
    if (t === 1) {
        const b = rand(2, 9), a = b * rand(2, 12);
        return { question: `${a} ÷ ${b}`, answer: a / b, points: 200 };
    }
    const a = rand(10, 99), b = rand(10, 99);
    return { question: `${a} + ${b}`, answer: a + b, points: 200 };
}
exports.default = new forgescript_1.NativeFunction({
    name: '$gameNewMath',
    description: 'Generates a new math question. Returns JSON: { question, points }.',
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
        if (session.type !== 'math')
            return this.customError('This session is not a math game.');
        if (session.status !== 'active')
            return this.customError('The game has not started yet.');
        const q = generateMath(session.difficulty);
        session.data.question = q.question;
        session.data.answer = q.answer;
        session.data.points = q.points;
        session.data.answered = false;
        return this.successJSON({ question: q.question, points: q.points });
    },
});
//# sourceMappingURL=gameNewMath.js.map