const path = require('path');module.exports = {
    entry: './app.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'index.js',
      libraryTarget: 'commonjs'
    },
    target: 'node',
    mode: 'production'
}

/* 
example 
https://hackernoon.com/deploying-a-node-js-twitter-bot-on-aws-lambda-using-webpack-df6e2e187a78
*/