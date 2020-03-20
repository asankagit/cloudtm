const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
import config from "../../config/evars.js";

export const s3stream = new S3StreamLogger({
  bucket: config.bucket,
  folder: "nodejslambda",
  access_key_id: config.access_key_id,
  secret_access_key: config.secret_access_key
});


// s3stream.write("hello S3");
var aws = require('aws-sdk');
export const s3 = new aws.S3({
  bucket: config.bucket,
  folder: "nodejslambda",
  access_key_id: config.access_key_id,
  secret_access_key: config.secret_access_key,
  apiVersion: '2006-03-01',
  region: "ap-south-1"
})

