const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});
const uuidV4 = require('uuid/v4');

exports.recordVisitorDetails = (event, context, callback) => {

    const {body} = event;
    const {siteId} = JSON.parse(body);
    
    const visitorId = uuidV4();
    const sourceIp = event.requestContext.identity.sourceIp;
    const userAgent = event.requestContext.identity.userAgent;
    const currentTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    let visitorData = {
        TableName: 'SITE_VISITORS',
        Item: {
            'VISITOR_UID' : {S: visitorId},
            'SITE_ID' : {S: siteId},
            'SOURCE_IP' : {S: sourceIp},
            'USER_AGENT' : {S: userAgent},
            'TIME': {S: currentTime}
        }
    };

    console.log(visitorData);

    dynamodb.putItem(visitorData, function(err, data) {
        if (err) {
            console.log("error", err);
            callback(null, {
                statusCode: 400,
                body: JSON.stringify(err)
            });
        }
        else {
            console.log("success", data);
            callback(null, {
                statusCode: 200,
                headers: {
                    "x-custom-header" : "my custom header value",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    siteId:siteId,
                    sourceIp:sourceIp,
                    userAgent:userAgent,
                    message:"Visitor Details Recorded"
                })
            });
        }
    });
};

exports.listVisitorDetails = (event, context, callback) =>{

    const username = event.requestContext.authorizer.username;
    const role = event.requestContext.authorizer.role;
    const siteId = event.queryStringParameters.siteId;

    console.log(`User:${username} Role:${role}`);

    const visitorParam = {
        TableName: 'SITE_VISITORS',
        IndexName: "SITE_ID-INDEX",
        ExpressionAttributeValues: {
            ':siteId': {S: siteId}
        },
        KeyConditionExpression: 'SITE_ID = :siteId'
    };


    dynamodb.query(visitorParam, function(err, data) {
        if (err) {
            console.log("error", err);
            callback(null, {
                statusCode: 400,
                body: JSON.stringify(err)
            });
        }
        else {
            console.log("success", data.Items);
            
            let visitorDataArr = [];
            data.Items.forEach(function(element, index, array) {
              visitorDataArr.push({
                  visitorId:element.VISITOR_UID.S,
                  sourceIp:element.SOURCE_IP.S,
                  userAgent:element.USER_AGENT.S,
                  time:element.TIME.S
              });
            });

            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    siteId:siteId,
                    visitorDetails:visitorDataArr,
                    message:"Visitors Retrieved Successfully"
                })
            });
        }
    });
}