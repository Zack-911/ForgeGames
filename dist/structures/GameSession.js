"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessions = void 0;
// ============================================================
//  SessionManager — singleton that owns all game sessions
// ============================================================
class SessionManager {
    sessions = new Map();
    /** One active session per channel at most. Key = guildId:channelId */
    channelKey(guildId, channelId) {
        return `${guildId}:${channelId}`;
    }
    create(opts) {
        const key = this.channelKey(opts.guildId, opts.channelId);
        if (this.sessions.has(key))
            return null; // already a game here
        const session = {
            id: key,
            type: opts.type,
            guildId: opts.guildId,
            channelId: opts.channelId,
            hostId: opts.hostId,
            status: 'waiting',
            difficulty: opts.difficulty ?? 'medium',
            players: new Map(),
            startedAt: null,
            endedAt: null,
            timeoutMs: opts.timeoutMs ?? 30_000,
            timeoutHandle: null,
            maxPlayers: opts.maxPlayers ?? 10,
            data: opts.data ?? {},
        };
        this.sessions.set(key, session);
        return session;
    }
    get(guildId, channelId) {
        return this.sessions.get(this.channelKey(guildId, channelId)) ?? null;
    }
    getById(id) {
        return this.sessions.get(id) ?? null;
    }
    destroy(guildId, channelId) {
        const key = this.channelKey(guildId, channelId);
        const session = this.sessions.get(key);
        if (!session)
            return false;
        if (session.timeoutHandle)
            clearTimeout(session.timeoutHandle);
        this.sessions.delete(key);
        return true;
    }
    /** Returns all sessions for a guild */
    forGuild(guildId) {
        return [...this.sessions.values()].filter((s) => s.guildId === guildId);
    }
    /** Adds or updates a player in a session */
    addPlayer(session, userId) {
        if (!session.players.has(userId)) {
            session.players.set(userId, {
                userId,
                score: 0,
                joinedAt: Date.now(),
                correctAnswers: 0,
                wrongAnswers: 0,
            });
        }
        return session.players.get(userId);
    }
    removePlayer(session, userId) {
        return session.players.delete(userId);
    }
    /** Sorted leaderboard for a session */
    leaderboard(session) {
        return [...session.players.values()].sort((a, b) => b.score - a.score);
    }
    start(session) {
        session.status = 'active';
        session.startedAt = Date.now();
    }
    end(session) {
        session.status = 'ended';
        session.endedAt = Date.now();
        if (session.timeoutHandle) {
            clearTimeout(session.timeoutHandle);
            session.timeoutHandle = null;
        }
    }
    /** Schedule auto-end. Returns old timeout handle for cancellation. */
    setTimeout(session, callback, ms) {
        if (session.timeoutHandle)
            clearTimeout(session.timeoutHandle);
        session.timeoutHandle = setTimeout(callback, ms);
    }
    clearTimeout(session) {
        if (session.timeoutHandle) {
            clearTimeout(session.timeoutHandle);
            session.timeoutHandle = null;
        }
    }
    /** Total sessions currently alive */
    get size() {
        return this.sessions.size;
    }
}
exports.sessions = new SessionManager();
//# sourceMappingURL=GameSession.js.map