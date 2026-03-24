"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
const WordData_js_1 = require("../../structures/WordData.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameNewScramble',
    description: [
        'Generates a scrambled word for players to unscramble.',
        'Returns JSON: { scrambled, wordLength, points, difficulty }.',
        'The correct answer is never revealed until someone solves it or the game ends.',
    ].join(' '),
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        { name: 'guildID', description: 'Guild of the session', type: forgescript_1.ArgType.Guild, required: true, rest: false },
        { name: 'channelID', description: 'Channel of the session', type: forgescript_1.ArgType.Channel, required: true, rest: false },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [guild, channel]) {
        const g = guild ?? ctx.guild;
        const ch = channel ?? ctx.channel;
        if (!g || !ch)
            return this.customError('No guild or channel found.');
        const session = GameSession_js_1.sessions.get(g.id, ch.id);
        if (!session)
            return this.customError('No active game session found.');
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