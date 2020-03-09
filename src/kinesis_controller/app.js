const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;
import { s3stream } from "./WriteS3"
import express from "express"
// const fetch = require("node-fetch")

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
        event.Records.forEach(function(record) {
            // Kinesis data is base64 encoded so decode here
            var payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
            console.log('Decoded payload:', payload);
            s3stream._write(payload)
        });
    }
    catch(e) {
        console.log("kinesis listener error", e)
        return {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'no kinneissi'
            })
        }
    }

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

