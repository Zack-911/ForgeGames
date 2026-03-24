"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const GameSession_js_1 = require("../../structures/GameSession.js");
exports.default = new forgescript_1.NativeFunction({
    name: '$gameGuildSessions',
    description: 'Returns a JSON array of all active game sessions in the given guild.',
    version: '1.0.0',
    brackets: false,
    unwrap: true,
    args: [
        {
            name: 'guildID',
            description: 'Guild to query (defaults to current guild)',
            type: forgescript_1.ArgType.Guild,
            required: true,
            rest: false,
        },
    ],
    output: forgescript_1.ArgType.Json,
    execute(ctx, [guild]) {
        const g = guild ?? ctx.guild;
        if (!g)
            return this.customError('No guild found.');
        const all = GameSession_js_1.sessions.forGuild(g.id).map((s) => ({
            id: s.id,
            type: s.type,
            channelId: s.channelId,
            status: s.status,
            difficulty: s.difficulty,
            playerCount: s.players.size,
            startedAt: s.startedAt,
        }));
        return this.successJSON(all);
    },
});
//# sourceMappingURL=gameGuildSessions.js.map