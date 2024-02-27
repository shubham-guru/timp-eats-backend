type IHttpResponse ={
    code:number
    body:string | number | Array<string|object|number> | object
}
function buildResponse({code, body} : IHttpResponse){
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