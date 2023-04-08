'use strict';

const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: slsw.lib.entries,
  target: 'node',
  resolve: {
    extensions: ['.mjs', '.ts', '.js', '.json'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|js)$/,
            exclude: [/node_modules/],
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
};
