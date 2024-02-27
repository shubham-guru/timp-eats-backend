



export function generateScanParams({ filters } :any) {
    if (!filters.length) return {
        expand: false,
        names: {},
        values: {},
        expression: {}
    }
    const names = Object.fromEntries(filters.map((filter :any, index :number) => {
        return [`#F${index}`, filter.name]
    }))
    const values = Object.fromEntries(filters.map((filter :any, index :number) => {
        return [`:val${index}`, filter.value]
    }))
    const namesKeys = Object.keys(names)
    const valuesKeys = Object.keys(values)
    const expression = filters.map((filter :any, index :number ):any => {
        return filter.operator?.padEnd(filter.operator?.length + 1)
                               .concat(parseExpressionCondition({
            name: namesKeys[index],
            value: valuesKeys[index],
            expression: filter.expression
        }))
    }).join(' ').trim()
    return {
        expand: true,
        names: names,
        expression: expression,
        values: values
    }
}

export function generateQueryParams({dbName, partition = {}, sort = {}, filters}:any){

    const sortExpression = sort.name ?  parseSortExpression({
        name: '#KS',
        value: 'valS',
        expression: sort.expression
    }) : '';

    let filterExpression = '';

    let names = [['#KP', partition.name], ...(sort.name ? [['#KS', sort.name]] : [])];

    const values = filters.map(({ name, value, expression, operator } :any , index :number) : any => {

        const [hashName, n] = (()=> {
            const matchedFilterName = names.find(([hash, filterName]) => filterName === name)
            if(!matchedFilterName) {
                names = names.concat([[`#F${index}`, name]])
                return [`#F${index}`, name]
            }
            return matchedFilterName
        })()

        filterExpression = filterExpression.concat(` ${operator} ${parseExpressionCondition({
            name: hashName,
            value: `:val${index}`,
            expression: expression
        })}`)

        return [`:val${index}`, value]
        
    }).concat([[`:valP`, partition.value], ...(sort.name ? [[`:valS`, sort.value]] : [])]);
    
    return {
        TableName: dbName,
        KeyConditionExpression: sortExpression ? '#KP = :valP' + ' AND ' + sortExpression : '#KP = :valP',
        ...(filterExpression ? {FilterExpression: filterExpression.trim()} : {}),
        ExpressionAttributeNames: Object.fromEntries(names),
        ExpressionAttributeValues: Object.fromEntries(values)
    }
}

function parseExpressionCondition({name, value, expression = 'equal'} :any){
    if(expression === 'equal') return [name, '=', value].join(' ')
    if(expression === 'notEqual') return [name, '<>', value].join(' ')
    if(expression === 'contains') return `contains(${name}, ${value})`
    if(expression === 'listAppend') return `list_append(${name}, ${value})`
    return `${name} = ${value}`
}


function parseSortExpression({name, value, expression = 'equal', betweenVal = ''}:any){
    if(expression === 'equal')return `${name} = :${value}`
    if(expression === 'lessThan')return `${name} < :${value}`
    if(expression === 'lessThanEqual')return `${name} <= :${value}`
    if(expression === 'greaterThan')return `${name} > :${value}`
    if(expression === 'greaterThanEqual')return `${name} >= :${value}`
    if(expression === 'between')return `${name} BETWEEN :${value} AND :${betweenVal}`
    if(expression === 'beginsWith')return `begins_with ( sortKeyName, :${value} )`
    return `${name} = :${value}`
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

export function generateUpdateParams({ item }: { item: Item }): UpdateParams | false {
    if (!item) return false;

    const values: ExpressionParams = {};
    const names: ExpressionParams = {};
    const expression = Object.entries(item).map(([property, value], index: number) => {
        values[`:val${index}`] = value;
        names[`#F${index}`] = property;
        // Assuming parseExpressionCondition returns a string
        return parseExpressionCondition({
            name: `#F${index}`,
            value: `:val${index}`,
            expression: 'equal'
        });
    }).join(', ');

    return {
        names: names,
        expression: 'SET ' + expression,
        values: values
    };
}


// function createBatchWriteParams(tableName,batchData){
//     return{
//         "RequestItems":{
//             [tableName]:[
               
//             ]
//         }
//     }
// }

// function createBatchWriteParams(tableName,batchData) {
//     return {
//         RequestItems: {
//             [tableName]:{
//             ...Object.fromEntries(batchData.map(({itemArray }) => {
//                 return [itemArray.map(item => {
//                     const { requestType = 'PutRequest', ...rest } = item;
//                     return {
//                         [requestType]: {
//                             Item: {
//                                 ...rest
//                             }
//                         }
//                     }
//                 })]
//             }))}
        
//         }
//         }
// }


// function createBatchDeleteParams(batchData) {
//     return {
//         RequestItems: {
//             ...Object.fromEntries(batchData.map(({ tableName, itemArray }) => {
//                 return [tableName, itemArray.map(item => {
//                     const { requestType = 'DeleteRequest', ...rest } = item;
//                     return {
//                         [requestType]: {
//                             Key: {
//                                 ...rest
//                             }
//                         }
//                     }
//                 })]
//             }))
//         }
//     }
// }

// function createBatchGetReadParams({ itemArray, tableName,projection }) {
//     //TODO: multiple table requests, Object.fromEntries, map different tableNames to different objects and spread
//     return {
//         RequestItems: {
//             [tableName]: {
//                 Keys: itemArray,
//                 ...(projection ?{ ProjectionExpression:projection}:[])
//             }
//         }
//     }
//   }

// function createBatchGetParams(batchGetData) {
//     // console.log(batchGetData);
//     return {
//         RequestItems: {
//             ...Object.fromEntries(batchGetData.map(({ itemArray, tableName }) => {
//                 // console.log(itemArray,tableName);
//                 return [ tableName,  { Keys: itemArray }]
//             }))
//         }
//     }
// }


