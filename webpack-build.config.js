var webpack = require('webpack');

module.exports = {
  entry: [
    './js/bootstrap',
    './js/index'
  ],
  output: {
    path: __dirname,
    // publicPath: '/build/',
    filename: './assets/bundle.js'
  },
  plugins: [
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loaders: ['jsx'] }
    ]
  }
};
