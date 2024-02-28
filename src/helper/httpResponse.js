
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

export {buildResponse }