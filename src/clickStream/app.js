const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});
exports.clickStreamWriteHandler = (event,context, callback) => {
    const  {body } = event
    const { type, timeStamp, basketId, basket_item, item_count, visitor, siteId} = JSON.parse(body)
    console.log(type, timeStamp, basketId, body)
    dynamodb.putItem({
            TableName: 'BASKET_EVENTS',
            Item: {
                'BASKET_ID': { S: basketId },
                'EVENT_TYPE': { S: type },
                'TIME_STAMP':{N: timeStamp.toString()},
                'BASKET_ITEM': {S: basket_item},
                'ITEM_COUNT': {N: item_count.toString()},
                'VISITOR': {S: visitor},
                'SITE_ID': {S: siteId}
            }
        }
        , function(err, data) {
            if (err) {
                console.log("err", err);
                // reject(err);
                callback(null, {
                    statusCode: 200,
                    headers: {
                        "x-custom-header" : "my custom header value",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: JSON.stringify(err),
                })
            } else {
                console.log("success", data);
                // resolve(data);
                callback(null, {
                    statusCode: 200,
                    headers: {
                        "x-custom-header" : "my custom header value",
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: "success",
                })
            }
        })
}