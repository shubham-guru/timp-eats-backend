
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { generateScanParams, generateQueryParams, generateUpdateParams } from "./db_helper";
import { BatchGetCommand, BatchWriteCommand, DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
// import { generateQueryParams, createBatchWriteParams } from 'simple-dynamo-utils'


const dynamodb = new DynamoDBClient({ region: 'us-east-1' });

const docClient = DynamoDBDocumentClient.from(dynamodb);

async function scanDynamoRecords({ dbName, itemsArray = [], filters = [], params, segmentObject = {}, projectionExpression, operator = 'OR' }:any) {
    //TODO: reserved keywords error handling
    const scanParams = params ?? (() => {
        const { expand, names, values, expression } = generateScanParams({ filters: filters, operator: operator });
        const projection = (()=>{
            if(typeof projectionExpression === 'object') return projectionExpression.map((proj :any) => String(proj).trim()).join(', ').toString()
            if(typeof projectionExpression === 'string') return projectionExpression
            return false
        })()
        const filterParams = expand ? {
            FilterExpression: expression,
            ExpressionAttributeNames: {
                ...names
            },
            ExpressionAttributeValues: {
                ...values
            }
        } : {}
        return new ScanCommand({
            TableName: dbName,
            ...(projection ? { ProjectionExpression : projection } : {}),
            ...filterParams,
            ...segmentObject
        })
    })()
    const database = await docClient.send(scanParams).then((response:any) => {
        return response
    }).catch((error :any) => {
        console.error('Error fetching items with parameters: ', JSON.stringify(scanParams), 'with error: ', error);
        return 'error'
    })
    itemsArray = itemsArray.concat(database.Items)
    if (database.LastEvaluatedKey) {
        return await scanDynamoRecords({
            itemsArray: itemsArray,
            params: {
                ...scanParams,
                ExclusiveStartKey: database.LastEvaluatedKey
            }
        })
    }
    return itemsArray;
}

async function scanWorkers({ dbName, itemsArray = [], filters = [], params, workers = 5, projection, operator = 'OR' }:any) {
    return (await Promise.all([...Array(workers).keys()].map(segment => {
        return scanDynamoRecords({
            dbName: dbName,
            itemsArray: itemsArray,
            filters: filters,
            params: params,
            segmentObject: {
                Segment: segment,
                TotalSegments: workers
            },
            projectionExpression: projection,
            operator: operator
        })
    }))).flat()
}
//TODO: improve multiple key system
async function getDynamoRecord({ dbName, keyObject, projection, filters = {}, messages = {} }:any){
    const scanParams = new GetCommand({
        TableName: dbName, 
        Key: {
            ...keyObject
        },
        ...filters, //TODO: remove
        ...(projection ? { ProjectionExpression: projection } : {}),
    })

    return docClient.send(scanParams).then((response:any) => {
        if(!response.Item) return { code: 404, body: messages[404] || ''}
        return { code: 200, body: response.Item }
    }).catch((error:any) => {
        console.error('Error occurred querying with parameters: ', scanParams, ' with error: ', error);
        return { code: 500, body: messages[500] || '' }
    })
}

async function getDynamoRecordByParams({params,messages = {}}:any){
    return docClient.send(new GetCommand(params)).then((response:any) => {
        if(!response.Item) return { code: 404, body: messages[404] || ''}
        return { code: 200, body: response.Item }
    }).catch((error:any) => {
        console.error('Error occurred querying with parameters: ', params, ' with error: ', error);
        return { code: 500, body: messages[500] || '' }
    })
}

// async function getDynamoRecord({dbName, keyObject, messages = {}, projection}){
//     const { partitionKeyObject, sortKeyObject = { } } = keyObject
//     const params = {
//         TableName: dbName,
//         Key: {
//             [partitionKeyObject.name]: partitionKeyObject.value,
//             ...(sortKeyObject.name ? {[sortKeyObject.name]: sortKeyObject.value} : {} )
//         },
//         ...(projection ? { ProjectionExpression: projection } : {})
//     }
//     return await dynamodb.get(params).promise()
//         .then((response) => { 
//             if(response.Item) return { code: 200, body: response.Item }
//             return { code: 404, body: messages[404] || 'no record found' }
//         })
//         .catch(error => {
//             console.log('Error getting Dynamo Record: ', error);
//             return { code: 400, body: messages[400] || messages[500] || 'invalid' }
//         })
// }

async function queryDynamoRecord({ dbName, partition : { name, value }, sort, filters = [], messages = {}, projection = '', indexName = '' }:any){
    
    //TODO: recursive run for last eval key
    const queryCommandParams = {
        ...generateQueryParams({
            table: dbName,
            partition: {
                name: name,
                value: value
            },
            ...(filters.length ? {filters: filters}:{}),
            ...(sort ? { sort : sort } : {}),
            ...(indexName ? { indexName : indexName } : {})
        }),
        ...(projection ? { ProjectionExpression: projection } : {}),
    }
    console.log("🚀 ~ file: dbFunctions.js:133 ~ queryDynamoRecord ~ scanParams:", queryCommandParams)
    const scanParams = new QueryCommand(queryCommandParams)

    return docClient.send(scanParams).then((response:any) => {
        if(!response.Items) return { code: 400, body: messages[400] || ''}
        if(!response.Items.length) return { code: 404, body: messages[404] || ''}
        return { code: 200, body: response.Items }
    }).catch((error:any) => {
        console.error("🚀 ~ file: dbFunctions.js:139 ~ returndocClient.send ~ error:", error)
        return { code: 500, body: messages[500] || '' }
    })
}

async function createDynamoRecord({dbName, item, messages = {} }:any){
    const params = new PutCommand({
        TableName: dbName,
        Item: item,
        
    })
    return docClient.send(params).then((response:any) => {
        return { code: 200, body: messages[200] || '' }
    }).catch((error:any) => {
        console.error('Error creating Item with details: ', params, ' with error: ', error);
        return { code: 500, body: messages[500] || '' }
    })
}

async function updateDynamo({params,errorMessages={}}:any){
    const sendParams = new UpdateCommand(params)
    console.log("🚀 ~ file: dbFunctions.js:162 ~ updateDynamo ~ sendParams:", sendParams)

    return docClient.send(sendParams).then((response:any) => {
        if (!response) return { code: 404, body: errorMessages[404] || '' }
        console.log(response);
        if (response) return { code: 200, body: response.Attributes || errorMessages[200] || '' }
        return { code: 200, body: response }
    }).catch((error:any) => {
        console.error('Error occurred while fetching data: ', params, ' with error: ', error);
        return { code: 500, body: errorMessages[400] || errorMessages[500] || '' }
    })
}

interface Item {
    [key: string]: any;
}

interface ExpressionParams {
    [key: string]: string;
}

interface UpdateParams {
    names: ExpressionParams;
    expression: string;
    values: ExpressionParams;
}
async function updateDynamoRecord({ dbName, key, item, returnItem = false, errorMessages = {} }:any) {
    const { names, expression, values } : UpdateParams = generateUpdateParams({
        item: item
    }) as UpdateParams

    const updateParams = {
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        UpdateExpression: expression
    }
     const sendParams :any ={
        TableName: dbName,
        Key: key,
        ...updateParams,
        ...(returnItem ? { ReturnValues: "ALL_OLD" } : {})
    }
    //  console.log("🚀 ~ file: dbFunctions.js:178 ~ updateDynamoRecord ~ sendParams:", sendParams)
    const params = new UpdateCommand(sendParams)

    return docClient.send(params).then((response:any) => {
        if (!response) return { code: 404, body: errorMessages[404] || '' }
        // console.log(response);
        if (returnItem) return { code: 200, body: response.Attributes || errorMessages[200] || '' }
        return { code: 200, body: response }
    }).catch((error:any) => {
        console.error('Error occurred while fetching data: ', params, ' with error: ', error);
        return { code: 500, body: errorMessages[400] || errorMessages[500] || '' }
    })
}

// async function readBatchDynamoRecords({ batchGetData, messages = {} }){
//     const params = new BatchGetCommand(createBatchGetParams(batchGetData))
//     // console.log(params);
//     return docClient.send(params).then(res => {
//         if(res.Responses) return res.Responses
//         console.log(res);
//     }).catch(error => {
//         console.error(error);
//         return 'error'
//     })
// }

// async function getBatchDynamoRecords({ itemArray, dbName,projection }:any){
//     const params = new BatchGetCommand(createBatchGetReadParams({
//         itemArray: itemArray,
//         tableName: dbName,
//         projection:projection
//     }))
//     return docClient.send(params).then(res => {
//         // console.log(res); //! remove after
//         if(res.Responses) return res.Responses
//     }).catch(error => {
//         return `${error}`
//     })
//   }

// async function  writeBatchObjects({tableName,batchWriteData, messages = {}}){
//     // console.log("🚀 ~ file: dbFunctions.js:218 ~ writeBatchObjects ~ batchWriteData:", batchWriteData)
//     const data = createBatchWriteParams([{
//         table: tableName,
//         putItems: batchWriteData
//     }])
//     // console.log("🚀 ~ file: dbFunctions.js:219 ~ writeBatchObjects ~ data:", data['RequestItems'][tableName].map(ele => console.log(ele)))
//     const params = new BatchWriteCommand(data)
//     return docClient.send(params).then(res => {
//         console.log(res);
//         return { code: 200, body: res }
//     }).catch(error => {
//         console.error('error: ',error);
//         return { code: 400, body: messages[400] || '' }
//     })
// }

// async function deleteBatchObjects({tableName,batchDeleteData, messages = {}}){
//     const data = createBatchWriteParams([{
//         table:tableName,
//         deleteItems:batchDeleteData
//     }])
//     // console.log("🚀 ~ file: dbFunctions.js:219 ~ writeBatchObjects ~ data:", data['RequestItems'][tableName].map(ele => console.log(ele)))
   
//     const params = new BatchWriteCommand(data)
//     return docClient.send(params).then(res => {
//         return { code: 200, body: res }
//     }).catch(error => {
//         console.error('error: ',error);
//         return { code: 400, body: messages[400] || '' }
//     })
// }




async function deleteDynamoRecord({ dbName, keyObject,returnItem=false, messages = {} }:any) {
    const params = new DeleteCommand({
        TableName: dbName,
        Key: {
            ...keyObject
        },
        ...(returnItem ? { ReturnValues: "ALL_OLD" } : {})
    })
    return await docClient.send(params).then((res:any) => {
        // console.log("🚀 ~ file: dbFunctions.js:261 ~ deleteDynamoRecord ~ res:", res)
        return { code: 200, body: res || 'successfully deleted' }
    }).catch((error:any) => {
        console.error('error: ', error);
        return { code: 400, body: messages[400] || '' }
    })
}




export {
    createDynamoRecord,
    deleteDynamoRecord,
    getDynamoRecord,
    generateScanParams,
    scanWorkers,
    queryDynamoRecord,
    updateDynamoRecord,
    updateDynamo,
    getDynamoRecordByParams
}