const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});
exports.clickStreamWriteHandler = (event,context, callback) => {
    const  {body } = event
    const { type, item, count, timeStamp, basketId} = JSON.parse(body)
    console.log(type, item, count, timeStamp, basketId, body)
    dynamodb.putItem({
            TableName: 'BASKET_EVENTS',
            Item: {
                'BASKET_ID': { S: basketId },
                'EVENT_TYPE': { S: type },
                'ITEM': {S: item},
                'COUNT': {N: count.toString()},
                'TIME_STAMP':{N: timeStamp.toString()}
            }
        }
        , function(err, data) {
            if (err) {
                console.log("err", err);
                // reject(err);
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(err),
                })
            } else {
                console.log("success", data);
                // resolve(data);
                callback(null, {
                    statusCode: 200,
                    body: "success",
                })
            }
        })
}