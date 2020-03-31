const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});
exports.lambdaHandler = async (event, context) => {
 
const { queryStringParameters,  multiValueQueryStringParameters, body } = event
const { filter, basketId } = queryStringParameters
// const bodyParams = JSON.parse(body)
// const { basketId } = bodyParams


// console.log(basketId)
// Async way
const promise = new Promise(function(resolve, reject){

    // setTimeout(function(){
    //     console.log("resolvedx")
    //     resolve({statusCode: 200, body: "resolvedx"})
    // }, 200)

    dynamodb.query({
        // ExpressionAttributeValues: {
        //     ':basket': basketId
        // },
        TableName: 'BASKET_EVENTS',
        IndexName: "BASKET_ID-TIME_STAMP-index",
        ProjectionExpression: "EVENT_TYPE",
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
            console.log("success", data);
            resolve({statusCode:200, body:JSON.stringify(data)});
        }
    })
})


return promise
};



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