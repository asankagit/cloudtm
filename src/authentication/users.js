const jwt = require('jsonwebtoken');
const key = 'ssssh';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ 
    region: 'ap-south-1',
    apiVersion: '2012-08-10'
});
const bcrypt = require('bcryptjs');
const authen = require('./perm.js');


exports.addUser = (event, context, callback) => {
    //Check Role
    const requesterRole = event.requestContext.authorizer.role;
    if(requesterRole!='admin'){
        console.log("Unauthorized");
        callback(null, {
            statusCode: 401,
            body: JSON.stringify({
                "message":"Insufficient Permission"
            })
        });
    }

    const {body} = event;
    const {username, password, email, role} = JSON.parse(body);
    
    addGeneralUser(username, password, email, role, callback);
};

exports.signUp = (event, context, callback) => {
    const {body} = event;
    const {username, password, email} = JSON.parse(body);
    addGeneralUser(username, password, email, "user", callback);
};


exports.signIn = (event, context, callback) => {
    const {body} = event;
    const {username, password} = JSON.parse(body);

    let usequeryParams = {
        TableName: 'USERS',
        Key: {
            'USERNAME' : {S: username},
        }
    };

    dynamodb.getItem(usequeryParams, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            callback(null, {
                statusCode: 400,
                body: JSON.stringify(err)
            });
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            validatePassword(data.Item, password, callback);
        }
    });
}

const addGeneralUser = (username, password, email, role, callback) => {
    let salt = bcrypt.genSaltSync(10);
    let passwordhash = bcrypt.hashSync(password, salt);

    let userdata = {
        TableName: 'USERS',
        Item: {
            'USERNAME' : {S: username},
            'PASSWORD' : {S: passwordhash},
            'EMAIL' : {S: email},
            'ROLE' : {S: role}
        }
    };

    console.log("Printing User Data");
    console.log(userdata);

    dynamodb.putItem(userdata, function(err, data) {
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
                body: JSON.stringify(data)
            });
        }
    });
}

const validatePassword = (user, enteredPassword, callback) => {
    console.log(`validate called user:${user} and enteredPassword:${enteredPassword}`)
    let dbPassHash = user.PASSWORD.S;
    let dbUserName = user.USERNAME.S;
    let dbUserRole = user.ROLE.S;

    console.log(`dbHash ${dbPassHash}`);
    
    if(bcrypt.compareSync(enteredPassword, dbPassHash)){
        let token = authen.generateToken(dbUserName, dbUserRole);
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                "message":"User Logged In",
                "token":token
            })
        });
    }
    else{
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({
                "message":"Invalid Password"
            })
        });
    }
}

