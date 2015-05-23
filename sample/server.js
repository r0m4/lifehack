
//var express = require('express');

var webpack = require('webpack');

//var webpackMiddleware = require('webpack-dev-middleware')

var WebpackDevServer = require('webpack-dev-server');

var config = require('./webpack.config');


//var app = express()

var port = process.env.npm_package_config_port || 3000;

var webpackServer = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true
})

// var wm = webpackMiddleware(webpack(config), {
//   publicPath: config.output.publicPath,
//   hot: true
// })

// app.use(wm)

var share=require('share')

console.log("ShareJS example server v" + share.version);

share.server.attach(webpackServer.app, {
  db:{type:'none'},
  browserChannel: {cors:'*'}
})



webpackServer.listen(port, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:' + port);
});



