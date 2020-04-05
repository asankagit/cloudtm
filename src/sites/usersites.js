const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const key = 'ssssh';
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});
const uuidV4 = require('uuid/v4');

exports.addUserSite = (event, context, callback) => {

    const {body} = event;
    const {sitename, description, domain} = JSON.parse(body);
    const siteid = uuidV4();
    const {Authorization} = event.headers;
    console.log(`Auth Token is ${Authorization}`);
    const username = decodeToken(Authorization);

    let sitedata = {
        TableName: 'USER_SITES',
        Item: {
            'USER_NAME' : {S: username},
            'SITE_ID' : {S: siteid},
            'SITE_NAME' : {S: sitename},
            'DESCRIPTION' : {S: description},
            'DOMAIN' : {S: domain}
        }
    };

    console.log("Printing Site Data");
    console.log(sitedata);

    dynamodb.putItem(sitedata, function(err, data) {
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
                body: JSON.stringify({
                    siteId:siteid,
                    siteName:sitename,
                    message:"Site Added Successfully"
                })
            });
        }
    });
};

exports.listSites = (event, context, callback) =>{
    const {Authorization} = event.headers;

    const username = decodeToken(Authorization);

    const siteparams = {
        TableName: 'USER_SITES',
        IndexName: "USER_NAME-INDEX",
        ExpressionAttributeValues: {
            ':un': {S: username}
        },
        KeyConditionExpression: 'USER_NAME = :un'
    };


    dynamodb.query(siteparams, function(err, data) {
        if (err) {
            console.log("error", err);
            callback(null, {
                statusCode: 400,
                body: JSON.stringify(err)
            });
        }
        else {
            console.log("success", data.Items);
            
            let siteDataArr = [];
            data.Items.forEach(function(element, index, array) {
              siteDataArr.push({
                  siteId:element.SITE_ID.S,
                  siteName:element.SITE_NAME.S,
                  domain:element.DOMAIN.S,
                  description:element.DESCRIPTION.S
              });
            });

            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    siteData:siteDataArr,
                    message:"Sites Retrieved Successfully"
                })
            });
        }
    });
}

const decodeToken = function(token){
    try{
        let decoded = jwt.verify(token, key);
        return decoded.user;
    }
    catch(err) {
        return "";
    }
};