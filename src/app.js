const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});
exports.lambdaHandler = async (event, context) => {
 
// Non-Async way
// dynamodb.putItem({
//             TableName: 'CUSTOMER_LIST',
//             Item: {
//                 'CUSTOMER_ID': { N: '043' },
//                 'CUSTOMER_NAME': { S: 'Corona' }
//             }
//         }
//         , function(err, data) {
//             if (err) {
//                 console.log("err", err);
//                 // reject(err);
//                 callback(null, {
//                     statusCode: 200,
//                     body: JSON.stringify(err),
//                 })
//             } else {
//                 console.log("success", data);
//                 // resolve(data);
//                 callback(null, {
//                     statusCode: 200,
//                     body: JSON.stringify(data),
//                 })
//             }
//         })
        
// Async way
const promise = new Promise(function(resolve, reject){

    // setTimeout(function(){
    //     console.log("resolvedx")
    //     resolve({statusCode: 200, body: "resolvedx"})
    // }, 200)

    dynamodb.putItem({
        TableName: 'CUSTOMER_LIST',
        Item: {
            'CUSTOMER_ID': { N: '036' },
            'CUSTOMER_NAME': { S: 'vilo' }
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