exports.frame = /^[0-9A-Za-z]+$/;
exports.name = /^[0-9A-Za-z\-]+$/;
exports.checkFilePath = function(str, update) {
  if (str == null || str == '') {
    return false;
  }
  if (!update && str.indexOf('index') == 0) {
    return false;
  }
  var result = /^[0-9A-Za-z\-\.\/]+$/.test(str);
  if (result) {
    if (str.indexOf('..') > -1) {
      result = false;
    } else if (str.indexOf('//') > -1) {
      result = false;
    }
  }
  return result;
};

exports.fileNameEmpty = '名称不能为空';
exports.fileNameError = '名称只能是数字、字符、-和.的组合';
exports.checkFileName = function(str) {
  if (str == null || str == '') {
    return false;
  }
  var result = /^[0-9A-Za-z\-\.]{1,16}$/.test(str);
  if (result) {
    if (str.indexOf('..') > -1) {
      result = false;
    }
  }
  return result;
};
