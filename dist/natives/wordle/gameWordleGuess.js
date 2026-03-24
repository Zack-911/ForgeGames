"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
const WordData_js_1 = require("../../structures/WordData.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameWordleGuess',
    description: [
        'Submits a 5-letter Wordle guess.',
        'Returns JSON: { guess, tiles, tileArray, guessNumber, guessesLeft, won, lost, correctWord }.',
        'tiles is a string of emoji (🟩🟨⬛). tileArray is ["correct","present","absent",...] for custom rendering.',
        'correctWord is only revealed on win or loss.',
    ].join(' '),
    version: '1.0.0',
    brackets: true,
    unwrap: true,
    args: [
        { name: 'guildID', description: 'Guild of the session', type: forgescript_1.ArgType.Guild, required: true, rest: false },
        { name: 'channelID', description: 'Channel of the session', type: forgescript_1.ArgType.Channel, required: true, rest: false },
        { name: 'guess', description: 'A 5-letter word', type: forgescript_1.ArgType.String, required: true, rest: false },
        { name: 'userID', description: 'Override user ID', type: forgescript_1.ArgType.User, required: false, rest: false },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [guild, channel, guess, user]) {
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
            return this.customError('The game is not active.');
        if (!session.data.word)
            return this.customError('No word has been set. Use $gameNewWordle first.');
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.customError('Could not determine user.');
        if (!session.players.has(userId))
            return this.customError('You are not in this game. Use $gameJoin first.');
        const secret = String(session.data.word);
        const len = secret.length;
        const clean = guess.toLowerCase().replace(/[^a-z]/g, '');
        if (clean.length !== len)
            return this.customError(`Guess must be exactly ${len} letters.`);
        const guesses = session.data.guesses;
        const maxGuesses = session.data.maxGuesses;
        if (guesses.length >= maxGuesses)
            return this.customError('No guesses remaining.');
        const tiles = (0, WordData_js_1.wordleResult)(secret, clean);
        // Build per-letter state array for custom rendering
        const TILE_MAP = { '🟩': 'correct', '🟨': 'present', '⬛': 'absent' };
        const tileArray = [...tiles].map(e => TILE_MAP[e] ?? 'absent');
        guesses.push(clean);
        const results = session.data.results ?? [];
        results.push(tileArray);
        session.data.guesses = guesses;
        session.data.results = results;
        // Calculate correctly guessed letters with details
        // Type: full (correct position), partial (present), none (absent)
        const correctlyGuessed = clean.split('').map((char, i) => {
            const tile = tileArray[i];
            return {
                character: char,
                position: i,
                type: tile === 'correct' ? 'full' : tile === 'present' ? 'partial' : 'none'
            };
        });
        // Calculate tried letters status (cumulative)
        const triedLetters = {};
        const STATUS_PRIORITY = { 'none': 0, 'absent': 1, 'present': 2, 'correct': 3 };
        guesses.forEach((g, idx) => {
            const res = results[idx];
            g.split('').forEach((char, i) => {
                const status = res[i];
                const currentBest = triedLetters[char] ?? 'none';
                if (STATUS_PRIORITY[status] > STATUS_PRIORITY[currentBest]) {
                    triedLetters[char] = status;
                }
            });
        });
        const player = session.players.get(userId);
        const won = clean === secret;
        const lost = !won && guesses.length >= maxGuesses;
        if (won) {
            const bonusPoints = Math.max(100, 600 - (guesses.length - 1) * 100);
            player.score += bonusPoints;
            player.correctAnswers += 1;
        }
        else {
            player.wrongAnswers += 1;
        }
        const ext = ctx.client.getExtension(index_js_1.ForgeGames, true);
        ext['emitter'].emit('gamesWordleGuess', session.id, g.id, ch.id, userId, clean, tiles);
        return this.successJSON({
            guess,
            tiles,
            tileArray,
            correctlyGuessed,
            triedLetters,
            guessNumber: guesses.length,
            guessesLeft: maxGuesses - guesses.length,
            maxGuesses,
            won,
            lost,
            correctWord: won || lost ? secret : null,
            pointsEarned: won ? Math.max(100, 600 - (guesses.length - 1) * 100) : 0,
        });
    },
});
//# sourceMappingURL=gameWordleGuess.js.map