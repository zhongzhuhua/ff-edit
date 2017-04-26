var fs = require('fs');
var result = fs.existsSync('/Users/zhongzhuhua/ice/work/ff-edit/examples/react/src/demo/hello.jssdafasdf', function(err) {
  console.log(err);
});
console.log(result);
fs.createWriteStream('/Users/zhongzhuhua/ice/work/ff-edit/examples/react/src/demo/hello.js', '');


// var path = require('path');

// var projectName = __dirname + '/examples/react/src';
// var len = projectName.length + 1;
// var result = getAllFiles(projectName);
// /**
//  * 读取目录下所有文件
//  * @param root 根目录
//  * @param pid 父目录
//  */

// function getAllFiles(root) {
//   var res = [];

//   var files = fs.readdirSync(root);
//   files.forEach(function(file) {
//     var pathname = root + '/' + file;
//     var stat = fs.lstatSync(pathname);

//     res.push(pathname.substr(len));
//     if (!stat.isDirectory()) {
//       var fitlPath = path.resolve(root, file).replace(/\\/g, '/');
//     } else {
//       res = res.concat(getAllFiles(pathname));
//     }
//   });

//   // console.log(res);
//   return res;
// };

// var nodes = [];
// for (var key in result) {
//   nodes.push({
//     name: result[key],
//     id: result[key],
//     pid: result[key].substr(0, result[key].lastIndexOf('/'))
//   });
// }
// console.log(nodes);
