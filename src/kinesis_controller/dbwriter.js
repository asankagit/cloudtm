const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});
const uuidV4 = require('uuid/v4');

exports.handler = function(event, context) {
    //console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here
        const payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', payload);
        
        const {siteId, scrollTopPercentage, scrollBottomPercentage, blog, time} = JSON.parse(payload);
        const scrollId = uuidV4();

        let scrollData = {
            TableName: 'SITE_SCROLL_DATA',
            Item: {
                'SCROLL_UID' : {S: scrollId},
                'SITE_ID' : {S: siteId},
                'BLOG' : {S: blog},
                'TIME': {S: time},
                'TOP_PERCENTAGE' : {N: `${scrollTopPercentage}`},
                'BOTTOM_PERCENTAGE' : {N: `${scrollBottomPercentage}`}
            }
        };
    
        console.log(scrollData);
    
        dynamodb.putItem(scrollData, function(err, data) {
            if (err) {
                console.log("error", err);
            }
            else {
                console.log("success", data);
            }
        });

    });
};

const compareRanges = (percentages, y1, y2) =>{
    percentages.forEach(percentile=>{
        if(percentile.ub<y1 || percentile.lb>y2)
            ;
        else{
            percentile.count++;
        }
    });
    return percentages;
};


exports.listScrollDetails = (event, context, callback) =>{

    const username = event.requestContext.authorizer.username;
    const role = event.requestContext.authorizer.role;
    const siteId = event.queryStringParameters.siteId;

    console.log(`User:${username} Role:${role}`);

    const scrollParam = {
        TableName: 'SITE_SCROLL_DATA',
        IndexName: "SITE_ID-INDEX",
        ExpressionAttributeValues: {
            ':siteId': {S: siteId}
        },
        KeyConditionExpression: 'SITE_ID = :siteId'
    };


    dynamodb.query(scrollParam, function(err, data) {
        if (err) {
            console.log("error", err);
            callback(null, {
                statusCode: 400,
                body: JSON.stringify(err)
            });
        }
        else {
            console.log("success", data.Items);
            
            let percentages = [{lb:0,ub:25,count:0},{lb:26,ub:50,count:0},{lb:51,ub:75,count:0},{lb:76,ub:100,count:0}];
            
            data.Items.forEach(function(element, index, array) {
              percentages = compareRanges(percentages, element.TOP_PERCENTAGE.N, element.BOTTOM_PERCENTAGE.N);
            });

            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    siteId:siteId,
                    scrollSummary:percentages,
                    message:"Scroll Summary Successfully"
                })
            });
        }
    });
}