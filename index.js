import { buildResponse } from './src/helper/httpResponse.js';
import { getRoutes } from './src/router.js';
import { createOrderWithUser, updateOrder } from './src/fucntion/dbHandle.js';
import { checkout, paymentVerification } from './src/fucntion/paymentHandle.js';
import {parse} from "partparse";

export async function handler(event) {
    try {
        const {
            httpMethod: method,
            path = "",
            // headers: { Authorization: auth },
            headers,
            queryStringParameters,
            body: unknownTypeBody,
            isBase64Encoded,
            resource,
            pathParameters ,
          } = event;
          console.log("🚀 ~ consthandler:APIGatewayProxyHandler= ~ event:", event)
          
        //   let response = { code: 401, body: "" };

          const parsedBody = await (async () => {
            if (isBase64Encoded && unknownTypeBody) return parse(unknownTypeBody);
            return unknownTypeBody;
          })();
        let response ={
            statusCode: 200,
            body: JSON.stringify({ message: 'Success' }),
            // add other properties as needed, such as headers
        };
        if(pathParameters === null) return buildResponse({code:401, body: "access_denied"})
        const proxy = pathParameters.proxy ;

        const routes = getRoutes(path, method,proxy);

        switch(routes){
            case "createOrder":
                response = await createOrderWithUser(parsedBody)
                break;
            case "checkout":
                response = await checkout(parsedBody)
                break;
            case "updateOrder":
                response = await updateOrder(parsedBody)
                break;
            case 'getPaymentConfirmation':
                response = await paymentVerification(parsedBody)
                break;
            default:
                break;
        }
        return response
    } catch (error) {
        console.log("🚀 ~ handler ~ error:", error)
        // Handle errors
        const response = buildResponse({
            code: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
            // add other properties as needed, such as headers
        });

        return response;
    }
};

export default handler