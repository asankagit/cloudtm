const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
import * as config from "../../config/evars.json";

export const s3stream = new S3StreamLogger({
  bucket: config.secret_access_key,
  folder: "nodejslambda",
  access_key_id: config.access_key_id,
  secret_access_key: config.secret_access_key
});

// s3stream.write("hello s3")
// s3stream.write("hello S3");