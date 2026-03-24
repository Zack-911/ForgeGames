"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessions = void 0;
// ─── tiny UUID generator (no external deps) ─────────────────────────────────
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}
// ─── SessionManager ──────────────────────────────────────────────────────────
class SessionManager {
    /** Primary store: UUID → session */
    sessions = new Map();
    // ── CRUD ──────────────────────────────────────────────────────────────────
    create(opts) {
        const session = {
            id: uuid(),
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
        this.sessions.set(session.id, session);
        return session;
    }
    /** Look up by UUID — the standard lookup used by all game functions. */
    getById(id) {
        return this.sessions.get(id) ?? null;
    }
    /** Destroy by UUID. */
    destroy(id) {
        const session = this.sessions.get(id);
        if (!session)
            return false;
        if (session.timeoutHandle)
            clearTimeout(session.timeoutHandle);
        this.sessions.delete(id);
        return true;
    }
    // ── Query helpers ─────────────────────────────────────────────────────────
    /** All sessions for a guild, optionally filtered by channel. */
    forGuild(guildId, channelId) {
        return [...this.sessions.values()].filter((s) => s.guildId === guildId && (channelId === undefined || s.channelId === channelId));
    }
    /** First active/waiting session in a channel (for $gameExists / $gameIsActive). */
    forChannel(guildId, channelId) {
        return ([...this.sessions.values()].find((s) => s.guildId === guildId && s.channelId === channelId) ??
            null);
    }
    // ── Player management ─────────────────────────────────────────────────────
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
    leaderboard(session) {
        return [...session.players.values()].sort((a, b) => b.score - a.score);
    }
    // ── Lifecycle ─────────────────────────────────────────────────────────────
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
    get size() {
        return this.sessions.size;
    }
}
exports.sessions = new SessionManager();
//# sourceMappingURL=GameSession.js.map