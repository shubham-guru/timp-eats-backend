import { APIGatewayProxyHandler , APIGatewayProxyEvent, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { buildResponse } from './helper/httpResponse';
import { getRoutes } from './router';
// import {parse} from "partparse";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
    try {
        const {
            httpMethod: method,
            path = "",
            headers: { Authorization: auth },
            queryStringParameters,
            body: unknownTypeBody,
            isBase64Encoded,
            resource,
            pathParameters ,
            requestContext : { stage : region },
          } = event;
          console.log("🚀 ~ consthandler:APIGatewayProxyHandler= ~ event:", event)
          
        //   let response = { code: 401, body: "" };

          const parsedBody = await (async () => {
            if (isBase64Encoded && unknownTypeBody) return JSON.parse(unknownTypeBody);
            return unknownTypeBody;
          })();
        let response: APIGatewayProxyResult ={
            statusCode: 200,
            body: JSON.stringify({ message: 'Success' }),
            // add other properties as needed, such as headers
        };
        if(pathParameters === null) return buildResponse({code:401, body: "access_denied"})
        const proxy: string = pathParameters.proxy as string;

        const routes = getRoutes(path, method,proxy);

        switch(routes){
            case "createOrder":
                response = await crateOrder(parsedBody)
                break;
            case "updateOrder":
                response = await updateOrder(parsedBody)
                break;
            case 'getPaymentKey':
                response = await getPaymentKey()
                break;
            case 'getPaymentConfirmation':
                response = await getPaymentConfirmation()
                break;
            default:
                break;
        }
        return response
    } catch (error) {
        // Handle errors
        const response: APIGatewayProxyResult = {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
            // add other properties as needed, such as headers
        };

        return response;
    }
};
