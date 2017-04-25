var express = require('express');
var http = require('http');
var ip = require('ip');
var fs = require('fs');
var webpackConfig = require('./webpack.config');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

if (process.env.nodeEnv == 'dev') {
  var port = process.env.port || 8300;
  var app = express();


  var server = http.createServer(app);
  var compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    noInfo: true,
    inline: true,
    stats: {
      cached: false,
      colors: true
    }
  }));
  app.use(webpackHotMiddleware(compiler));
  app.use('/public', express.static('public'));
  app.use('/projects', express.static('examples'));

  // 循环配置控制器路由表
  Array.from(['find'], (page) => {
    require('./actions/' + page)(app);
    return page;
  });

  Array.from(['ope'], (page) => {
    require('./actions/' + page)(app);
    return page;
  });

  server.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
      console.log(err);
    }
    console.log(ip.address() + ':' + port);
  });

  // 重载配置
  var reload = require('reload');
  reload(server, app);
}
