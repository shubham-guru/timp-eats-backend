
function buildResponse({code, body}){
    return {
        statusCode: code,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST'
        },
        body: JSON.stringify(body)
    }
}

function builRedirectResponse({code, body}){
    return {
        statusCode: code,
        headers: {
            Location: body // Specify the redirect URL in the Location header
        }
    }
}

export {buildResponse, builRedirectResponse }