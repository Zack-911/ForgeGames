"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
const TriviaData_js_1 = require("../../structures/TriviaData.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameNewTrivia',
    description: 'Loads a new trivia question into the session. Returns JSON: { question, choices, category, points }.',
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
        {
            name: 'category',
            description: 'Filter by category (general|science|history|geography|sports|entertainment|technology)',
            type: forgescript_1.ArgType.String,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [sessionID, category]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        if (session.type !== 'trivia')
            return this.customError('This session is not a trivia game.');
        if (session.status !== 'active')
            return this.customError('The game has not started yet.');
        const asked = session.data.asked ?? [];
        const q = (0, TriviaData_js_1.getQuestion)({
            category: category,
            difficulty: session.difficulty,
            exclude: asked,
        });
        if (!q)
            return this.customError('No more questions available for this category/difficulty combination.');
        const shuffled = (0, TriviaData_js_1.shuffleChoices)(q);
        asked.push(q.question);
        session.data.asked = asked;
        session.data.question = q.question;
        session.data.answer = q.answer;
        session.data.choices = shuffled;
        session.data.points = q.points;
        session.data.category = q.category;
        session.data.answered = false;
        const ext = ctx.client.getExtension(index_js_1.ForgeGames, true);
        GameSession_js_1.sessions.setTimeout(session, () => {
            if (session.status === 'active' && !session.data.answered) {
                ext['emitter'].emit('gamesAnswerTimeout', session.id, session.guildId, session.channelId);
            }
        }, session.timeoutMs);
        return this.successJSON({
            question: q.question,
            choices: shuffled,
            category: q.category,
            points: q.points,
        });
    },
});
//# sourceMappingURL=gameNewTrivia.js.map