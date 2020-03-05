const AwsSamPlugin = require("aws-sam-webpack-plugin");
const awsSamPlugin = new AwsSamPlugin();
const path = require('path');

module.exports = {
    //entry: './app.js',
    entry: () => awsSamPlugin.entry(),
    output: {
      path: path.resolve("."),
      filename: (chunkData) => awsSamPlugin.filename(chunkData),
      libraryTarget: 'commonjs'
    },
    target: 'node',
    mode: 'production',

      // Add the AWS SAM Webpack plugin
    plugins: [awsSamPlugin]
}

/* 
example 
https://hackernoon.com/deploying-a-node-js-twitter-bot-on-aws-lambda-using-webpack-df6e2e187a78
*/