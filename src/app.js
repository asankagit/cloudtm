
let response;
import { s3stream } from "./kinesis_controller/WriteS3"
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

exports.lambdaHandler = async (event, context) => {
    try {
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'hello world s3 streram test',
                location: "seri"
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
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

