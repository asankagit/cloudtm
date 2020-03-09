const S3StreamLogger = require('s3-streamlogger').S3StreamLogger;

export const s3stream = new S3StreamLogger({
             bucket: "aws-sam-cli-managed-default-samclisourcebucket-11ckjuy8eoxq8",
             folder: "nodejslambda",
      access_key_id: "AKIAUXPMTIE6UCEQFDPD",
  secret_access_key: "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"
});

// s3stream.write("hello s3")
// s3stream.write("hello S3");