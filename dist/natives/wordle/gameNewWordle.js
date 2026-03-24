"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
const WordData_js_1 = require("../../structures/WordData.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameNewWordle',
    description: 'Starts a new Wordle round. Returns JSON with the max guesses allowed and difficulty.',
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
        if (session.type !== 'wordle')
            return this.customError('This session is not a Wordle game.');
        if (session.status !== 'active')
            return this.customError('The game has not started yet.');
        const word = (0, WordData_js_1.getWord)(session.difficulty);
        const maxGuesses = session.difficulty === 'easy' ? 8 : session.difficulty === 'hard' ? 4 : 6;
        session.data.word = word;
        session.data.guesses = [];
        session.data.results = [];
        session.data.maxGuesses = maxGuesses;
        return this.successJSON({
            maxGuesses,
            difficulty: session.difficulty,
            wordLength: word.length,
            word
        });
    },
});
//# sourceMappingURL=gameNewWordle.js.map