import handler from "./index.js";

const event = {
  resource: '/{proxy+}',
  path: '/order',
  httpMethod: 'POST',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    Host: 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com',
    'Postman-Token': '2b84b02d-f569-43ca-82d3-de7c21002866',
    'User-Agent': 'PostmanRuntime/7.36.3',
    'X-Amzn-Trace-Id': 'Root=1-65df8908-4b1b8ce44e598aef5b0516c5',
    'X-Forwarded-For': '117.197.40.205',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https'
  },
  multiValueHeaders: {
    Accept: [ '*/*' ],
    'Accept-Encoding': [ 'gzip, deflate, br' ],
    'Cache-Control': [ 'no-cache' ],
    'Content-Type': [ 'application/json' ],
    Host: [ 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com' ],
    'Postman-Token': [ '2b84b02d-f569-43ca-82d3-de7c21002866' ],
    'User-Agent': [ 'PostmanRuntime/7.36.3' ],
    'X-Amzn-Trace-Id': [ 'Root=1-65df8908-4b1b8ce44e598aef5b0516c5' ],
    'X-Forwarded-For': [ '117.197.40.205' ],
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
    extendedRequestId: 'T3JZWFPXoAMEG4g=',
    requestTime: '28/Feb/2024:19:27:04 +0000',
    path: '/dev/order',
    accountId: '767397751609',
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'nbz0awbsjf',
    requestTimeEpoch: 1709148424393,
    requestId: '595363f1-cbc4-4043-89d6-56dbf3501f6e',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: null,
      cognitoIdentityId: null,
      caller: null,
      sourceIp: '117.197.40.205',
      principalOrgId: null,
      accessKey: null,
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: null,
      userAgent: 'PostmanRuntime/7.36.3',
      user: null
    },
    domainName: 'nbz0awbsjf.execute-api.us-east-1.amazonaws.com',
    deploymentId: 'yxgrfx',
    apiId: 'nbz0awbsjf'
  },
  body: '{\n' +
    '    "user": {\n' +
    '        "email": "string@g.com",\n' +
    '        "phone_number": 123123,\n' +
    '        "full_name": "",\n' +
    '        "complete_address": [\n' +
    '            {\n' +
    '                "city": "sadd"\n' +
    '            }\n' +
    '        ]\n' +
    '    },\n' +
    '    "order": { "payment_mode": "paypal",\n' +
    '        "order_detail": [\n' +
    '            {"product_name": "string", "quantity": 3, "unit": 3, "price": 3\n' +
    '            }\n' +
    '        ],\n' +
    '        "delievery_charge": 9,\n' +
    '        "tax": 9,\n' +
    '        "total_price": 9,\n' +
    '        "status": "cart"\n' +
    '    }\n' +
    '}',
  isBase64Encoded: false
}

console.time();
handler(event).then((data) => {
  console.log(data);
  console.timeEnd();
});
