"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessions = exports.ForgeGames = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const path_1 = __importDefault(require("path"));
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const ForgeGamesEventManager_js_1 = require("./structures/ForgeGamesEventManager.js");
class ForgeGames extends forgescript_1.ForgeExtension {
    options;
    name = 'ForgeGames';
    description = 'Interactive games extension for ForgeScript — Trivia, Wordle, Hangman, Math Blitz, Scramble, Tic-Tac-Toe, RPS';
    version = '1.0.0';
    client;
    commands;
    events = new tiny_typed_emitter_1.TypedEmitter();
    constructor(options) {
        super();
        this.options = options;
    }
    async init(client) {
        const start = Date.now();
        this.client = client;
        this.commands = new ForgeGamesEventManager_js_1.ForgeGamesCommandManager(client);
        this.load(path_1.default.join(__dirname, './natives'));
        forgescript_1.EventManager.load('ForgeGames', path_1.default.join(__dirname, '/events'));
        const eventsToLoad = this.options.events;
        if (eventsToLoad.length) {
            this.client.events.load('ForgeGames', eventsToLoad);
        }
        this.events.on('error', (err) => {
            forgescript_1.Logger.error('[ForgeGames] Unhandled emitter error:', err);
        });
        forgescript_1.Logger.info(`[ForgeGames] Initialized in ${Date.now() - start}ms`);
    }
}
exports.ForgeGames = ForgeGames;
var GameSession_js_1 = require("./structures/GameSession.js");
Object.defineProperty(exports, "sessions", { enumerable: true, get: function () { return GameSession_js_1.sessions; } });
//# sourceMappingURL=index.js.map