const jwt = require('jsonwebtoken');
const key = 'ssssh';

function generateAuthResponse(principalId, effect, userRole) {
    const policyDocument = generatePolicyDocument(effect, "*");
    const context = generateContext(principalId, userRole);
    return {
        principalId,
        policyDocument,
        context
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

function generateContext(username, role){
    const context = {
        username: username,
        role: role
    };
    return context;
}

exports.generateToken = function(username, role){
    let token = jwt.sign({ 
                    user: `${username}`,
                    role: `${role}`,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, `${key}`);
    return token;
}

exports.authorizer = async function (event) {
    const token = event.authorizationToken;

    try{
        
        let decoded = jwt.verify(token, key);
        return generateAuthResponse(decoded.user, 'Allow', decoded.role);
    }
    catch(err) {
        console.log(`deny err:${err}`);
        return generateAuthResponse(decoded.user, 'Deny', decoded.role);
    }
}