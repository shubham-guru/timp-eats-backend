import handler from "./index.js";

const event = {
  resource: '/{proxy+}',
  path: '/order',
  httpMethod: 'POST',
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    Host: 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com',
    origin: 'http://localhost:5173',
    referer: 'http://localhost:5173/',
    'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'X-Amzn-Trace-Id': 'Root=1-6624ceec-30aafb042c3572511e085b1c',
    'X-Forwarded-For': '117.208.127.115',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    accept: [ 'application/json, text/plain, */*' ],
    'accept-encoding': [ 'gzip, deflate, br, zstd' ],
    'accept-language': [ 'en-US,en;q=0.9' ],
    'content-type': [ 'application/json' ],
    Host: [ 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com' ],
    origin: [ 'http://localhost:5173' ],
    referer: [ 'http://localhost:5173/' ],
    'sec-ch-ua': [
      '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"'
    ],
    'sec-ch-ua-mobile': [ '?0' ],
    'sec-ch-ua-platform': [ '"Windows"' ],
    'sec-fetch-dest': [ 'empty' ],
    'sec-fetch-mode': [ 'cors' ],
    'sec-fetch-site': [ 'cross-site' ],
    'User-Agent': [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    ],
    'X-Amzn-Trace-Id': [ 'Root=1-6624ceec-30aafb042c3572511e085b1c' ],
    'X-Forwarded-For': [ '117.208.127.115' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: { proxy: 'order' },
  stageVariables: null,
  requestContext: {
    resourceId: 'pzixso',
    resourcePath: '/{proxy+}',
    httpMethod: 'POST',
    extendedRequestId: 'WkVE7GtvIAMErNA=',
    requestTime: '21/Apr/2024:08:31:40 +0000',
    path: '/dev/order',
    accountId: '767397751609',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'nbz0awbsjf',
    requestTimeEpoch: 1713688300058,
    requestId: '7165df79-6af0-41dc-ba5d-5bb23bae26de',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '117.208.127.115',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      user: null
    },
    domainName: 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com',
    deploymentId: 'izgn4q',
    apiId: 'nbz0awbsjf'
  },
  body: '{"user":{"full_name":"d","email":"sinhamanish107@gmail.com","complete_address":[{"street":"hsdb","city":"Ashok Nagar (Patna)","landmark":"ncklsdn","state":"Bihar","country":"IN","pincode":"800020"}],"phone_number":"+917894756123"},"order":{"payment_mode":"paypal","order_detail":[{"id":1,"productInfo":{"img":"/src/assets/product images/bajraImg.jpg","name":"Bajra Laddu","totalPrice":279,"quantity":250,"qtyLabel":"250g","units":1}}],"total_price":324,"tax":0,"delievery_charge":"₹49","status":"cart"},"amount":324,"currency":"USD"}',
  isBase64Encoded: false
}

console.time();
handler(event).then((data) => {
  console.log("response",data);
  console.timeEnd();
});
