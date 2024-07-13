import { buildResponse } from './src/helper/httpResponse.js';
import { getRoutes } from './src/router.js';
import { createOrderWithUser, getUser, updateOrder } from './src/fucntion/dbHandle.js';
import {parse} from "partparse";
import { paymentVerification } from './src/fucntion/paymentHandle.js';

export async function handler(event) {
    try {
        const {
            httpMethod: method,
            path = "",
            // headers: { Authorization: auth },
            headers,
            queryStringParameters : queryParams,
            body: unknownTypeBody,
            isBase64Encoded,
            resource,
            pathParameters ,
          } = event;
          console.log("🚀 ~ consthandler:APIGatewayProxyHandler= ~ event:", event)
          
        //   let response = { code: 401, body: "" };

          const parsedBody = await (async () => {
            if (isBase64Encoded && unknownTypeBody) return parse(event);
            return unknownTypeBody;
          })();
        let response ={
            statusCode: 400,
            body: JSON.stringify({ message: 'bad request' }),
            // add other properties as needed, such as headers
        };
        if(pathParameters === null) return buildResponse({code:401, body: "access_denied"})
        const proxy = pathParameters.proxy ;

        const routes = getRoutes(path, method,proxy);

        switch(routes){
            case "createOrder":
                response = await createOrderWithUser(parsedBody)
                console.log("🚀 ~ handler ~ response:", response)
                break;
            case "updateOrder":
                response = await updateOrder(parsedBody)
                break;
            case 'paymentConfirmation':
                response = await paymentVerification(parsedBody)
                break;
            case 'getUser':
                response = await getUser(queryParams)
                break;
            case "invalidRequest":
                response = buildResponse({code:401,body:{success:false,message:'access denied'}})
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