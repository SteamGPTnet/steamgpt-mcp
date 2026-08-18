# steamgpt-mcp

MCP server for Steam data, backed by [steamgpt.net](https://steamgpt.net) - a free Steam data API for AI agents. Steam profiles, SteamID conversion, VAC / game / community / trade bans, FACEIT stats, public friend graph, batch lookups and player comparison. No API key, no registration, no tracking.

Registry name: `net.steamgpt/steamgpt` ([official MCP Registry](https://registry.modelcontextprotocol.io/v0.1/servers/net.steamgpt%2Fsteamgpt/versions/latest)).

[![SteamGPT MCP server](https://glama.ai/mcp/servers/q1y6yl24ol/badges/score.svg)](https://glama.ai/mcp/servers/SteamGPTnet/steamgpt-mcp)

## Quick start

The server runs remotely - the preferred setup is a direct Streamable HTTP connection, no install:

```bash
claude mcp add --transport http steamgpt https://steamgpt.net/mcp
```

Cursor (`.cursor/mcp.json` in a project, or `~/.cursor/mcp.json` globally):

```json
{ "mcpServers": { "steamgpt": { "url": "https://steamgpt.net/mcp" } } }
```

VS Code (Command Palette -> "MCP: Open User Configuration"):

```json
{ "servers": { "steamgpt": { "type": "http", "url": "https://steamgpt.net/mcp" } } }
```

For clients that only support stdio servers, use this package as a proxy:

```json
{ "mcpServers": { "steamgpt": { "command": "npx", "args": [ "-y", "steamgpt-mcp" ] } } }
```

## The 8 tools

| Tool | What it answers |
| --- | --- |
| `steam_identity` | convert / resolve any SteamID form, vanity or profile link (fewest tokens) |
| `steam_bans` | VAC, game, community and economy (trade) bans - first check for a cheating report |
| `steam_profile` | raw Steam summary only (cheapest profile tool) |
| `steam_faceit` | FACEIT player object: level, ELO, FACEIT bans |
| `steam_friends` | public Steam friend graph (detail: short / medium / full) |
| `steam_summary` | everything about one player; `include` trims the response |
| `steam_batch` | up to 100 profiles in ONE call - always batch instead of per-player calls |
| `steam_compare` | two players side by side + shared friends |

All tools are read-only and need no confirmation. Responses carry `provenance` (freshness) and `sources`/`partial` markers - branch on them, not on nulls.

## Notes

- `{id}` accepts steamid64, `STEAM_1:0:x`, `[U:1:x]`, a steamcommunity.com link or a vanity name.
- The HTTP API behind this server also answers in `.md` / `.json` / `.ai` formats: see [steamgpt.net/ai](https://steamgpt.net/ai) and [docs](https://steamgpt.net/docs.md).
- Env override for the proxy: `STEAMGPT_MCP_URL` (default `https://steamgpt.net/mcp`).
- Fair use: soft limit 120 requests/min per IP; responses are cached.

SteamGPT is an independent service and is not affiliated with Valve Corporation or Steam.

MIT (c) SteamGPT - [steamgpt.net](https://steamgpt.net)
