var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
  entry: {
    clipboard: APP_DIR + '/clipboard.js',
    test: APP_DIR + "/test.js"
  },
  output: {
    path: BUILD_DIR,
    filename: '[name]_bundle.js'
  },

   module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel'
      }
    ]
  }
};

module.exports = config;
