// Live smoke test of the stdio proxy against steamgpt.net/mcp: npm test
// Full MCP cycle: initialize -> notifications/initialized -> tools/list -> tools/call

import { spawn } from 'node:child_process'

let fails = 0

function check( name, cond ) {
    console.log( ( cond ? 'OK   ' : 'FAIL ' ) + name )
    if( ! cond ) fails++
}

const proxy = spawn( process.execPath, [ new URL('./bin/steamgpt-mcp.js', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1') ], { "stdio": [ 'pipe', 'pipe', 'inherit' ] } )

let stdout_proxy = ''

proxy.stdout.on('data', ( chunk ) => { stdout_proxy += chunk.toString() })

proxy.stdin.write( JSON.stringify({ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": { "protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": { "name": "smoke-test", "version": "1.0" } } }) + '\n' )
proxy.stdin.write( JSON.stringify({ "jsonrpc": "2.0", "method": "notifications/initialized" }) + '\n' )
proxy.stdin.write( JSON.stringify({ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }) + '\n' )
proxy.stdin.write( JSON.stringify({ "jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": { "name": "steam_identity", "arguments": { "id": "76561197960287930" } } }) + '\n' )
proxy.stdin.end()

await new Promise( ( resolve ) => proxy.on('close', resolve) )

const responses = stdout_proxy.trim().split('\n').filter( ( line ) => line != '' ).map( ( line ) => JSON.parse( line ) )

check( '3 responses for 3 requests (notification produces none)', responses.length == 3 )

const by_id = {}
for( const r of responses ) by_id[ r['id'] ] = r

check( 'initialize: serverInfo answered', typeof by_id[1]?.result?.serverInfo?.version == 'string' )
check( 'tools/list: 8 read-only tools', ( by_id[2]?.result?.tools || [] ).length == 8 )

const text_call = by_id[3]?.result?.content?.[0]?.text || ''

check( 'tools/call steam_identity: resolves the seed id', text_call.includes('76561197960287930') && text_call.includes('STEAM_1:0:11101') )

console.log( fails == 0 ? '\nALL GREEN' : '\nFAILED: ' + fails )
process.exit( fails == 0 ? 0 : 1 )
