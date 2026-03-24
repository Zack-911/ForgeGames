"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameWordleGuessCount',
    description: 'Returns JSON with guesses used, guesses left, and the full guess+tile history.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'guildID',
            description: 'Guild of the session',
            type: forgescript_1.ArgType.Guild,
            required: true,
            rest: false,
        },
        {
            name: 'channelID',
            description: 'Channel of the session',
            type: forgescript_1.ArgType.Channel,
            required: true,
            rest: false,
        },
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
        const guesses = session.data.guesses ?? [];
        const results = session.data.results ?? [];
        const maxGuesses = session.data.maxGuesses ?? 6;
        // Calculate tried letters status (cumulative)
        const triedLetters = {};
        const STATUS_PRIORITY = { none: 0, absent: 1, present: 2, correct: 3 };
        guesses.forEach((g, idx) => {
            const res = results[idx];
            if (!res)
                return;
            g.split('').forEach((char, i) => {
                const status = res[i];
                if (!status)
                    return;
                const currentBest = triedLetters[char] ?? 'none';
                if (STATUS_PRIORITY[status] > STATUS_PRIORITY[currentBest]) {
                    triedLetters[char] = status;
                }
            });
        });
        return this.successJSON({
            guessesUsed: guesses.length,
            guessesLeft: maxGuesses - guesses.length,
            maxGuesses,
            triedLetters,
            history: guesses.map((g, idx) => {
                const res = results[idx] ?? [];
                return {
                    guess: g,
                    tileArray: res,
                    correctLetters: g.split('').map((char, i) => ({
                        character: char,
                        position: i,
                        type: res[i] === 'correct' ? 'full' : res[i] === 'present' ? 'partial' : 'none',
                    })),
                };
            }),
        });
    },
});
//# sourceMappingURL=gameWordleGuessCount.js.map