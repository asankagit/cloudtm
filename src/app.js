
let response;
import { s3stream, s3 } from "./kinesis_controller/WriteS3"
import { db } from "./dynamoDB/ddb_createtable"
import express from "express"


/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

exports.lambdaHandler = function (event, context, callback) {
    const s3Promise = s3.listBuckets().promise()

    const putObjectPromise = new Promise((resolve, reject) => {
        s3.putObject({
            Bucket: "aws-sam-cli-managed-default-samclisourcebucket-11ckjuy8eoxq8",
            Key: "sample.txt",
            Body: "Hello, World!",
        }, function (err, data) {
            if (err) {
                console.log(err)
                reject(err)
            }
            else {
                console.log("Successfully uploaded data to ");
                resolve(data)
            }

        });
    })

    const dbPromise = new Promise((resolve, reject) => {
        var params = {
            TableName: 'CUSTOMER_LIST',
            Item: {
              'CUSTOMER_ID' : {N: '002'},
              'CUSTOMER_NAME' : {S: JSON.stringify({name:"asanka", age: 22})}
            }
          };
          
          // Call DynamoDB to add the item to the table
          db.ddb.putItem(params, function(err, data) {
            if (err) {
              console.log("Error", err);
              reject(err)
            } else {
              console.log("Success", data);
              resolve(data)
            }
          })
    })
    

    Promise.all([dbPromise]).then((data) => {
        callback(null, {
            "statusCode": "200",
            "body": JSON.stringify({
                message: data,
                time: "123456789"
            })
        })
    })


}


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

