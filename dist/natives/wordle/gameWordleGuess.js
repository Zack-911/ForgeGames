"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const index_js_1 = require("../../index.js");
const GameSession_js_1 = require("../../structures/GameSession.js");
const WordData_js_1 = require("../../structures/WordData.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameWordleGuess',
    description: 'Submits a 5-letter Wordle guess. Returns JSON: { guess, tiles, tileArray, guessNumber, guessesLeft, maxGuesses, won, lost, correctWord, pointsEarned }.',
    version: '1.0.0',
    brackets: true,
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
            name: 'guess',
            description: 'A 5-letter word',
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false,
        },
        {
            name: 'userID',
            description: 'Override user ID',
            type: forgescript_1.ArgType.User,
            required: false,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [sessionID, guess, user]) {
        const session = GameSession_js_1.sessions.getById(sessionID);
        if (!session)
            return this.customError('No game session found for the given ID.');
        if (session.type !== 'wordle')
            return this.customError('This session is not a Wordle game.');
        if (session.status !== 'active')
            return this.customError('The game is not active.');
        if (!session.data.word)
            return this.customError('No word set. Use $gameNewWordle first.');
        const userId = user?.id ?? ctx.user?.id ?? ctx.member?.id;
        if (!userId)
            return this.customError('Could not determine user.');
        if (!session.players.has(userId))
            return this.customError('You are not in this game. Use $gameJoin first.');
        const clean = guess.toLowerCase().replace(/[^a-z]/g, '');
        if (clean.length !== 5)
            return this.customError('Guess must be exactly 5 letters.');
        const guesses = session.data.guesses;
        const maxGuesses = session.data.maxGuesses;
        if (guesses.length >= maxGuesses)
            return this.customError('No guesses remaining.');
        const secret = String(session.data.word);
        const tiles = (0, WordData_js_1.wordleResult)(secret, clean);
        const TILE_MAP = { '🟩': 'correct', '🟨': 'present', '⬛': 'absent' };
        const tileArray = tiles.split('').map((e) => TILE_MAP[e] ?? 'absent');
        guesses.push(clean);
        const results = session.data.results ?? [];
        results.push(tileArray);
        session.data.guesses = guesses;
        session.data.results = results;
        const player = session.players.get(userId);
        const won = clean === secret;
        const lost = !won && guesses.length >= maxGuesses;
        const pointsEarned = won ? Math.max(100, 600 - (guesses.length - 1) * 100) : 0;
        if (won) {
            player.score += pointsEarned;
            player.correctAnswers += 1;
        }
        else
            player.wrongAnswers += 1;
        ctx.client
            .getExtension(index_js_1.ForgeGames, true)['emitter'].emit('gamesWordleGuess', session.id, session.guildId, session.channelId, userId, clean, tiles);
        return this.successJSON({
            guess,
            tiles,
            tileArray,
            guessNumber: guesses.length,
            guessesLeft: maxGuesses - guesses.length,
            maxGuesses,
            won,
            lost,
            correctWord: won || lost ? secret : null,
            pointsEarned,
        });
    },
});
//# sourceMappingURL=gameWordleGuess.js.map