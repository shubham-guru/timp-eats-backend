import handler from "./index.js";

const event = {
  resource: '/{proxy+}',
  path: '/paymentConfirmation',
  httpMethod: 'POST',
  headers: {
    accept: 'application/json, text/plain, */*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    Host: 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com',
    origin: 'http://localhost:5173',
    priority: 'u=1, i',
    referer: 'http://localhost:5173/',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'X-Amzn-Trace-Id': 'Root=1-66921150-62f305c4339805871941afe4',
    'X-Forwarded-For': '103.175.180.75',
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
    priority: [ 'u=1, i' ],
    referer: [ 'http://localhost:5173/' ],
    'sec-ch-ua': [
      '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"'
    ],
    'sec-ch-ua-mobile': [ '?0' ],
    'sec-ch-ua-platform': [ '"Windows"' ],
    'sec-fetch-dest': [ 'empty' ],
    'sec-fetch-mode': [ 'cors' ],
    'sec-fetch-site': [ 'cross-site' ],
    'User-Agent': [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    ],
    'X-Amzn-Trace-Id': [ 'Root=1-66921150-62f305c4339805871941afe4' ],
    'X-Forwarded-For': [ '103.175.180.75' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: { proxy: 'paymentConfirmation' },
  stageVariables: null,
  requestContext: {
    resourceId: 'pzixso',
    resourcePath: '/{proxy+}',
    httpMethod: 'POST',
    extendedRequestId: 'a1eklEXFoAMEn-w=',
    requestTime: '13/Jul/2024:05:32:00 +0000',
    path: '/dev/paymentConfirmation',
    accountId: '767397751609',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'nbz0awbsjf',
    requestTimeEpoch: 1720848720236,
    requestId: 'f4070e59-3124-4419-bac1-39d750a711ea',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '103.175.180.75',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      user: null
    },
    domainName: 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com',
    deploymentId: 'izgn4q',
    apiId: 'nbz0awbsjf'
  },
  body: '{"razorpay_payment_id":"pay_OY1A1jDxwUH65k","razorpay_order_id":"order_OY19YI8BfgoGpi","currency":"INR","amount":5.81}',
  isBase64Encoded: false
}


console.time();
handler(event).then((data) => {
  console.log("response",data);
  console.timeEnd();
});
