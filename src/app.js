import { Basket } from "./basket/Basket"
 

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});

function formatDynamoResultToObject(result){
    const final = []
    result.map(element => {
    let tmp = {}
    const ele = JSON.parse(JSON.stringify(element))
    for(let key in ele) {
            let tmpObj = ele[key]
            tmp[key] = tmpObj[Object.keys(tmpObj)]
    }
    final.push(tmp)
    })
    return final
}

function filterStateFromBucket(obj, filter){
    const dbResult  = JSON.parse(obj)

    const { Items } = dbResult

    let array1 = []
    //----sample format(result from formatDynamoResultToObjec function)---------
    // [{count:1, item: "Single room", type: "add" },
    //             {ITEM_COUNT:3, BASKET_ITEM: "Double room", EVENT_TYPE: "add" },
    //             {ITEM_COUNT:2, BASKET_ITEM: "Single room", EVENT_TYPE: "add" },
    //             {ITEM_COUNT:3, BASKET_ITEM: "Double room", EVENT_TYPE: "remove" }
    //            ];
    // ----------------------------------------------------------------------

    if (Items) {
        array1 = formatDynamoResultToObject(Items)
        let basketObj = new Basket(array1)

        let finalResult
        switch(filter) {
            case 'removed': {
                finalResult = basketObj.getRemovedItems()
                break;
            }
            case 'final' :{
                finalResult = Basket.fetFinalStateFromBucket(array1)
                break;
            }
            default : {
                finalResult = []
                break;
            }
        }
        return finalResult
    }
    else {
        return []
    }
    
}


exports.lambdaHandler = async (event, context) => {
 
const { queryStringParameters,  multiValueQueryStringParameters, body } = event
const { filter, basketId } = queryStringParameters
// const bodyParams = JSON.parse(body)
// const { basketId } = bodyParams

// Async way
const promise = new Promise(function(resolve, reject){

    dynamodb.query({
        TableName: 'BASKET_EVENTS',
        IndexName: "BASKET_ID-TIME_STAMP-index",
        ProjectionExpression: "EVENT_TYPE, BASKET_ID, BASKET_ITEM, ITEM_COUNT",
        KeyConditionExpression: "BASKET_ID = :basket",

        ExpressionAttributeValues: {
            ":basket": {S : basketId}
        }
    }
    , function(err, data) {
        if (err) {
            console.log("err", err);
            reject({statusCode:200, body:JSON.stringify(err)});
        } else {
            resolve({statusCode:200, body:JSON.stringify(data)});
        }
    })
})

const responseGeneratePromse = new Promise((resolve, reject) => {
    promise.then(dbResult => {
        const finalState = filterStateFromBucket(dbResult.body, filter)
        console.log("final state", finalState)
        resolve({
            statusCode: 200,
            body: finalState
        })
    })
    .catch(e => {
        reject(e)
    })
})
return responseGeneratePromse
};

// sampleresponse
// {
//     "Items": [
//         {
//             "EVENT_TYPE": {
//                 "S": "remove"
//             }
//         },
//         {
//             "EVENT_TYPE": {
//                 "S": "remove"
//             }
//         },
//         {
//             "EVENT_TYPE": {
//                 "S": "add"
//             }
//         }
//     ],
//     "Count": 3,
//     "ScannedCount": 3
// }

/**
 * fetch("http://localhost:3000/hello").then(res => res.body).then(body =>
 * {const reader = body.getReader(); return reader.read().then(  ({done, value}) => console.log(">>",done,value))   }).catch(e => console.log(e))
 *
 * var str = String.fromCharCode.apply(null, temp1);
 *
 * event source example
 * https://blog.risingstack.com/event-sourcing-with-examples-node-js-at-scale/
 *
 *
 * node .gyp run
 * https://blog.usejournal.com/how-to-run-native-addon-modules-for-node-js-in-aws-lambda-aa74e1a9010
 */