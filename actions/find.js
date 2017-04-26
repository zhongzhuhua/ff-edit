// Controller 路由器
var utils = require('../server/utils');
var reg = require('../components/reg');
var rootPath = process.cwd() + '/';

module.exports = function(app) {
  // 获取所有文件
  app.get('/actions/findByName', function(req, res) {
    var data = req.query;
    // 项目框架
    var frame = data.frame || 'react';
    // 项目名称
    var name = data.name || 'demo';

    var projectName = '';
    // 如果 prd 不为空，则读取项目 
    projectName = 'examples/' + frame + '/src/' + name;

    var filePath = rootPath + projectName;
    var data = getTreeNode(filePath);
    res.json({
      code: '000000',
      data: {
        name: projectName,
        files: data
      }
    });
  });

  // 获取单个文件内容
  app.get('/actions/findFile', function(req, res) {
    var data = req.query;
    // 项目框架
    var frame = data.frame || 'react';
    // 项目名称
    var name = data.name || 'demo';
    // 文件名称
    var fileName = data.fileName || 'index.html';

    fileName = rootPath + 'examples/' + frame + '/src/' + name + '/' + fileName;
    var fileContent = utils.readFileSync(fileName);
    res.json({
      code: '000000',
      data: fileContent
    });
  });
};


// 获取 node 树节点
function getTreeNode(projectName) {
  var doms = {};
  var index = 0;
  var result = utils.getAllFilesDir(projectName, projectName.length + 1);

  for (var key in result) {
    var value = result[key];
    doms[value] = ++index;
  }

  var nodes = [];
  for (var key in result) {
    var value = result[key];
    var lastIndex = result[key].lastIndexOf('/');
    var parent = value.substr(0, lastIndex);
    var name = value.substr(lastIndex > -1 ? lastIndex + 1 : 0);
    nodes.push({
      name: name,
      isParent: name.indexOf('.') == -1,
      key: value,
      id: doms[value] || 0,
      pId: doms[parent] || 0
    });
  }

  return nodes;
};
