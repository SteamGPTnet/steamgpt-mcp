#!/usr/bin/env node

// steamgpt-mcp: stdio proxy to the remote MCP server at steamgpt.net for clients
// without native Streamable HTTP support. The server is public, no keys needed.
// Every JSON-RPC message from stdin is POSTed to /mcp and the response goes to stdout;
// notifications (no id) are forwarded but produce no stdout response

const MCP_URL = process.env.STEAMGPT_MCP_URL || 'https://steamgpt.net/mcp'

let buffer_stdin = ''
let queue = Promise.resolve()

async function forwardMessage( line_raw ) {

    let message = null

    try {
        message = JSON.parse( line_raw )
    } catch ( e ) {
        return
    }

    const has_id = message !== null && typeof message == 'object' && typeof message['id'] !== 'undefined' && message['id'] !== null

    try {
        let response = await fetch( MCP_URL, {
            "method": 'POST',
            "headers": {
                "Content-Type": 'application/json',
                "Accept":       'application/json',
            },
            "body": JSON.stringify( message ),
        })

        if( ! has_id ) return

        let text_response = await response.text()

        if( text_response.trim() == '' ) return

        process.stdout.write( text_response.trim() + '\n' )
    } catch ( e ) {

        if( ! has_id ) return

        process.stdout.write( JSON.stringify({"jsonrpc": "2.0", "id": message['id'], "error": {"code": -32603, "message": 'steamgpt-mcp proxy: ' + ( e?.message || 'request failed' )}}) + '\n' )
    }
}

process.stdin.setEncoding('utf8')

process.stdin.on('data', ( chunk ) => {

    buffer_stdin += chunk

    let index_newline = buffer_stdin.indexOf('\n')

    while( index_newline !== -1 ) {

        const line = buffer_stdin.slice( 0, index_newline ).trim()

        buffer_stdin = buffer_stdin.slice( index_newline + 1 )

        if( line != '' ) queue = queue.then( () => forwardMessage( line ) )

        index_newline = buffer_stdin.indexOf('\n')
    }
})

process.stdin.on('end', () => {
    queue.then( () => process.exit( 0 ) )
})
