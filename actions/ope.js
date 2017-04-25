// Controller 路由器
var utils = require('../server/utils');
var rootPath = process.cwd() + '/';
var exec = require('child_process').exec;

module.exports = function(app) {

  // 构建项目
  app.get('/actions/opeBuild', function(req, res) {
    var data = req.query;
    // 项目框架
    var frame = data.frame || 'react';
    // 项目名称
    var name = data.name || 'demo';

    return new Promise((res) => {
      exec('cross-env nodeProject=' + name + ' nodeFrame=' + frame + ' webpack', {
        cwd: 'examples/' + frame
      }, function(err) {
        console.log(err);
        res(err == null ? '000000' : '-1')
      });
    }).then((code) => {
      res.json({
        code: code
      });
    });
  });

  // 保存文件
  app.post('/actions/saveFile', function(req, res) {
    utils.getPostData(req, function(data) {
      console.log(data);
    });
  });
};
