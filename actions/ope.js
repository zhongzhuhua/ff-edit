// Controller 路由器
var webpack = require('webpack');
var utils = require('../server/utils');
var reg = require('../components/reg');
var error = require('../components/error');
var rootPath = process.cwd() + '/';
var exec = require('child_process').exec;

module.exports = function(app) {

  // 构建项目
  app.get('/actions/build', function(req, res) {
    var data = req.query;
    // 项目框架
    var frame = data.frame || 'react';
    // 项目名称
    var name = data.name || 'demo';
    if (!reg.frame || !reg.name) {
      res.json(error.BuildError);
      return;
    }

    return new Promise((resolve) => {
      exec('cross-env nodeProject=' + name + ' nodeFrame=' + frame + ' webpack', {
        cwd: 'examples/' + frame
      }, function(err) {
        resolve(err == null ? null : error.BuildError);
      });
    }).then((result) => {
      res.json(result || {
        code: '000000'
      });
    });
  });

  // 保存文件
  app.post('/actions/saveFile', function(req, res) {
    return new Promise((resolve) => {
      utils.getPostData(req, function(data) {
        try {
          // 项目框架
          var frame = data.frame || 'react';
          // 项目名称
          var name = data.name || 'demo';
          // 文件名称
          var fileName = data.fileName;
          // 文件内容
          var content = data.content;

          if (!reg.frame.test(frame) || !reg.name.test(name) || !reg.checkFilePath(fileName, true)) {
            resolve(error.SaveFileError);
            return;
          }

          // 保存文件
          fileName = rootPath + 'examples/' + frame + '/src/' + name + '/' + fileName;
          utils.createFile(fileName, content || '');
          resolve();
        } catch (e) {
          console.log(e.message);
          resolve(error.Error);
        }
      });
    }).then((result) => {
      res.json(result || {
        code: '000000'
      });
    });
  });

  // 添加文件文件夹
  app.get('/actions/addFile', function(req, res) {
    return new Promise((resolve) => {
      try {
        var data = req.query;
        // 项目框架
        var frame = data.frame || 'react';
        // 项目名称
        var name = data.name || 'demo';
        // 文件路径
        var filePath = data.filePath;
        // 文件名称
        var fileName = data.fileName;
        // 类型 file = 文件，其他则默认文件夹
        var fileType = data.fileType || 'dir';

        if (!reg.frame.test(frame) || !reg.name.test(name) || !filePath || !reg.checkFilePath(filePath) || !reg.checkFileName(fileName)) {
          resolve(error.AddFileError);
          return;
        }

        // 保存文件
        fileName = rootPath + 'examples/' + frame + '/src/' + name + '/' + filePath + '/' + fileName;

        if (utils.isExistsSync(fileName)) {
          resolve(error.AddFileExists);
          return;
        }
        if (fileType == 'file') {
          utils.createFile(fileName, '');
        } else {
          utils.createExistsSync(fileName);
        }

        resolve();
      } catch (e) {
        console.log(e.message);
        resolve(error.Error);
      }
    }).then((result) => {
      res.json(result || {
        code: '000000'
      });
    });
  });

  // 重命名
  app.get('/actions/rename', function(req, res) {
    var data = req.query;
    // 项目框架
    var frame = data.frame || 'react';
    // 项目名称
    var name = data.name || 'demo';

    if (!reg.frame.test(frame) || !reg.name.test(name) || !reg.checkFilePath(data.oldName) || !reg.checkFilePath(data.newName)) {
      res.json(error.RenameError);
      return;
    }

    // 旧名称
    var oldName = rootPath + 'examples/' + frame + '/src/' + name + '/' + data.oldName;
    // 新名称
    var newName = rootPath + 'examples/' + frame + '/src/' + name + '/' + data.newName;

    // 重新命名
    return new Promise((resolve) => {
      try {
        var result = utils.rename(oldName, newName);
        resolve();
      } catch (e) {
        console.log(e.message);
        resolve(error.Error);
      }
    }).then((result) => {
      res.json(result || {
        code: '000000'
      });
    });
  });

  // 删除文件
  app.get('/actions/removeFile', function(req, res) {
    var data = req.query;
    // 项目框架
    var frame = data.frame || 'react';
    // 项目名称
    var name = data.name || 'demo';
    // 文件名称
    var fileName = data.fileName;
    // 类型 file = 文件，其他则默认文件夹
    var fileType = data.fileType || 'dir';

    if (!reg.frame.test(frame) || !reg.name.test(name) || !reg.checkFilePath(fileName)) {
      res.json(error.RemoveFileError);
      return;
    }

    return new Promise((resolve) => {
      try {
        fileName = rootPath + 'examples/' + frame + '/src/' + name + '/' + fileName;
        if (fileType == 'file') {
          utils.rmFile(fileName);
        } else {
          utils.rmFolder(fileName);
        }
        resolve();
      } catch (e) {
        console.log(e.message);
        resolve(error.Error);
      }
    }).then((result) => {
      res.json(result || {
        code: '000000'
      });
    });
  });

};
