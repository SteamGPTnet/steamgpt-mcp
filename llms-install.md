# Installing the SteamGPT MCP server (instructions for AI agents)

SteamGPT is a REMOTE MCP server - prefer a direct Streamable HTTP connection, no package install needed:

- URL: `https://steamgpt.net/mcp`
- Transport: `streamable-http` (stateless JSON-RPC 2.0 over POST)
- Auth: none (no API key, no OAuth)

## Preferred configuration (Streamable HTTP)

Claude Code: `claude mcp add --transport http steamgpt https://steamgpt.net/mcp`

Cline / Cursor style JSON config:

```json
{ "mcpServers": { "steamgpt": { "url": "https://steamgpt.net/mcp" } } }
```

## Fallback configuration (stdio proxy via npx)

Only if the client cannot connect to Streamable HTTP servers directly:

```json
{ "mcpServers": { "steamgpt": { "command": "npx", "args": [ "-y", "steamgpt-mcp" ] } } }
```

Requires Node.js >= 18. No environment variables are required; `STEAMGPT_MCP_URL` optionally overrides the server URL.

## Verification

After connecting, `tools/list` must return 8 read-only tools: steam_identity, steam_bans, steam_profile, steam_faceit, steam_friends, steam_summary, steam_batch, steam_compare. A quick test call: `steam_identity` with `{ "id": "76561197960287930" }` returns all SteamID forms of that account.
