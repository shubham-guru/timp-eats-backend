import handler from "./index.js";

const event = {
  resource: '/{proxy+}',
  path: '/order',
  httpMethod: 'GET',
  headers: {
    '2144-7843b693-10d3b58d-d7382d77-45d49665d507db7abc0': '',
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    Host: 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com',
    'Postman-Token': '9c8e8ffc-1d18-406f-83ec-7b5d4018fa96',
    'User-Agent': 'PostmanRuntime/7.36.3',
    'X-Amzn-Trace-Id': 'Root=1-65e0ade9-7de487170640d6983932bc51',
    'X-Forwarded-For': '49.43.177.124',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    '2144-7843b693-10d3b58d-d7382d77-45d49665d507db7abc0': [ '' ],
    Accept: [ '*/*' ],
    'Accept-Encoding': [ 'gzip, deflate, br' ],
    'Content-Type': [ 'application/json' ],
    Host: [ 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com' ],
    'Postman-Token': [ '9c8e8ffc-1d18-406f-83ec-7b5d4018fa96' ],
    'User-Agent': [ 'PostmanRuntime/7.36.3' ],
    'X-Amzn-Trace-Id': [ 'Root=1-65e0ade9-7de487170640d6983932bc51' ],
    'X-Forwarded-For': [ '49.43.177.124' ],
    'X-Forwarded-Port': [ '443' ],
    'X-Forwarded-Proto': [ 'https' ]
  },
  queryStringParameters: {email:'string@g.com'},
  multiValueQueryStringParameters: null,
  pathParameters: { proxy: 'getUser' },
  stageVariables: null,
  requestContext: {
    resourceId: 'pzixso',
    resourcePath: '/{proxy+}',
    httpMethod: 'POST',
    extendedRequestId: 'T6AcjHMqIAMEOJw=',
    requestTime: '29/Feb/2024:16:16:41 +0000',
    path: '/dev/order',
    accountId: '767397751609',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'nbz0awbsjf',
    requestTimeEpoch: 1709223401656,
    requestId: 'ffa5b897-4645-4a99-941b-d5e0a0cf6838',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '49.43.177.124',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'PostmanRuntime/7.36.3',
      user: null
    },
    domainName: 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com',
    deploymentId: 'izgn4q',
    apiId: 'nbz0awbsjf'
  },
  body: '{\n' +
    '    "user": {\n' +
    '        "email": "gurushubham4@gmail.com",\n' +
    '        "phone_number": 8955288660,\n' +
    '        "full_name": "Shubham Guru",\n' +
    '        "complete_address": [\n' +
    '            {\n' +
    '                "city": "jaipur",\n' +
    '                "state": "Raj"\n' +
    '            }\n' +
    '        ]\n' +
    '    },\n' +
    '    "order": {\n' +
    '        "payment_mode": "razorpay",\n' +
    '        "order_detail": [\n' +
    '            {\n' +
    '                "product_name": "Bajra sticks",\n' +
    '                "quantity": 3,\n' +
    '                "unit": 3,\n' +
    '                "price": 1000\n' +
    '            }\n' +
    '        ],\n' +
    '        "delievery_charge": 10,\n' +
    '        "tax": 9,\n' +
    '        "total_price": 9,\n' +
    '        "status": "cart"\n' +
    '    },\n' +
    '    "amount": 1010\n' +
    '}',
  isBase64Encoded: false
}

console.time();
handler(event).then((data) => {
  console.log(data);
  console.timeEnd();
});
