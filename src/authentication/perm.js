const jwt = require('jsonwebtoken');
const key = 'ssssh';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-southeast-1',
    apiVersion: '2012-08-10'
});

function generateAuthResponse(principalId, effect, methodArn) {
    const policyDocument = generatePolicyDocument(effect, methodArn);

    return {
        principalId,
        policyDocument
    }
}

function generatePolicyDocument(effect, methodArn) {
    if (!effect || !methodArn) return null

    const policyDocument = {
        Version: '2012-10-17',
        Statement: [{
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: methodArn
        }]
    };

    return policyDocument;
}

exports.generateToken = function(username){
    let token = jwt.sign({ 
                    user: `${username}`,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, `${key}`);
    return token;
}

exports.decodeToken = function(token){
    try{
        let decoded = jwt.verify(token, key);
        return decoded.user;
    }
    catch(err) {
        return "";
    }
}


exports.authorizer = async function (event) {
    const token = event.authorizationToken;
    const methodArn = event.methodArn;

    try{
        jwt.verify(token, key);
        return generateAuthResponse('user', 'Allow', methodArn);
    }
    catch(err) {
        return generateAuthResponse('user', 'Deny', methodArn);
    }
}