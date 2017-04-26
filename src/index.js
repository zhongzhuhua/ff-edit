import './index.scss';
import Loading from './js/Loading';
import Toast from './js/Toast';
import Reg from '../components/reg';

// 是否正在提交中
var issubmit = false;
// 当前操作的文件
var state = {
  fileName: ''
};
// 当前选中的文件夹
var chooseDirPath = '';
// 选中的文件夹
var chooseNode = null;
var $addFileName = $('#addFileName');
var $addFileType = $('#addFileType');
// 弹窗
var $dialogFrame = $('#dialogFrame');
var $dialogAdd = $('#dialogAdd');
// 初始化插件
var $codeEditor = $('#codeEditor');
var $frame = $('#frame');
var $name = $('#name');
var $code = $('#code');
var $content = $('#content');
// 创建编辑器
ace.require('ace/ext/language_tools');
var editor = ace.edit('editor');
editor.$blockScrolling = Infinity;
// editor.setTheme('ace/theme/xcode');
editor.setTheme('ace/theme/crimson_editor');

function init() {
  var frame = request('frame');
  var name = request('name');
  if (frame != '') {
    $frame.val(request('frame'));
  }
  $name.val(request('name'));
  find();
};

// 判断是否可以编辑
function ztreeEdit(treeId, treeNode) {
  if (treeNode.pId == null || treeNode.pId == '') {
    return false;
  }
  return true;
};

// 请求数据
var mydata = '';

function find() {
  if (issubmit) {
    return;
  }
  state.fileName = '';
  issubmit = true;
  Loading.open();
  var frame = $frame.val();
  var name = $name.val();
  mydata = {
    name: name,
    frame: frame
  };
  $.ajax({
    url: '/actions/findByName',
    dataType: 'json',
    data: mydata,
    success: function(data) {
      issubmit = false;
      Loading.close();
      if (data.code == '000000') {
        editor.getSession().setValue('');
        data = data.data;
        var project = data.name;
        var files = data.files;

        // 文件夹排序
        var nodes = [];
        for (var key in files) {
          if (files[key].isParent) {
            nodes.unshift(files[key]);
          } else {
            nodes.push(files[key]);
          }
        }
        var zTreeObj = $.fn.zTree.init($('#tree'), {
          data: {
            simpleData: {
              enable: true
            },
            keep: {
              leaf: true,
              parent: true
            }
          },
          view: {
            dblClickExpand: false
          },
          edit: {
            drag: {
              isMove: false,
              isCopy: false,
              next: false,
              prev: false
            },
            enable: true,
            showRemoveBtn: ztreeEdit,
            showRenameBtn: ztreeEdit
          },
          callback: {
            onClick: function(event, treeId, treeNode) {
              if (treeNode && !treeNode.isParent) {
                var filePath = ztreeGetFilePath(treeNode);
                getFile(filePath);
              }
            },
            // 双击添加文件
            beforeDblClick: function(treeId, treeNode) {
              if (treeNode && treeNode.isParent) {
                chooseDirPath = ztreeGetFilePath(treeNode);
                chooseNode = treeNode;
                $dialogAdd.show();
              }
              return false;
            },
            // 重命名节点
            beforeRename: function(treeId, treeNode, newName) {
              var treeObj = $.fn.zTree.getZTreeObj(treeId);
              if (newName == null || newName == '') {
                Toast.open(Reg.fileNameEmpty);
                treeObj.cancelEditName();
              } else if (!Reg.checkFileName(newName)) {
                Toast.open(Reg.fileNameError);
                treeObj.cancelEditName();
              } else {
                var key = ztreeGetFilePath(treeNode);
                var oldName = treeNode.name;
                if (newName == oldName) {
                  return true;
                } else {
                  newName = key.replace(/[^\/]*$/, newName);
                  var result = rename(key, newName);
                  if (!result) {
                    treeObj.cancelEditName();
                    return false;
                  }
                  return true;
                }
              }
              return false;
            },
            // 删除文件
            beforeRemove: function(treeId, treeNode) {
              var result = removeFile(treeNode);
              return result;
            }
          }
        }, nodes);
        setPageUrl();
      }
    },
    error: AjaxError
  });
};

// 获取文件名称
function ztreeGetFilePath(treeNode) {
  var fileName = '';
  if (treeNode) {
    var nodes = treeNode.getPath();
    for (var key in nodes) {
      var node = nodes[key];
      fileName += node.name + '/';
    }
  }
  return fileName.replace(/\/$/, '');
};

// 重命名
function rename(oldName, newName) {
  if (issubmit) {
    return;
  }
  issubmit = true;
  Loading.open();
  var result = false;
  $.ajax({
    url: '/actions/rename',
    async: false,
    data: {
      frame: mydata.frame,
      name: mydata.name,
      oldName: oldName,
      newName: newName
    },
    success: function(data) {
      issubmit = false;
      Loading.close();
      if (data.code == '000000') {
        result = true;
      } else {
        Toast.open('重命名文件失败，请确保文件名有效');
      }
    },
    error: AjaxError
  });
  return result;
};

// 设置页面
function setPageUrl() {
  var projectName = '/projects/' + (mydata.frame || 'react') + '/dist/' + (mydata.name || 'demo');
  var link = projectName + '/index.html';
  var src = $content.attr('src');
  if (src != null && src.indexOf(projectName) != -1) {
    link = src;
  }
  link = link.replace(/&*____\d+____/, '');
  var time = '&____' + new Date().getTime() + '____';
  $content.attr('src', link.indexOf('?') == -1 ? (link + '?' + time) : (link + time));
};

// 获取文件内容
function getFile(fileName) {
  if (issubmit || fileName == null || fileName == '' || fileName.indexOf('.') < 1) {
    return;
  }
  if (fileName == state.fileName) {
    return;
  }
  issubmit = true;
  Loading.open();
  $.ajax({
    url: '/actions/findFile',
    dataType: 'json',
    data: {
      frame: mydata.frame,
      name: mydata.name,
      fileName: fileName
    },
    success: function(data) {
      issubmit = false;
      Loading.close();
      var name = fileName.replace(/\//g, '-');
      if ($('#' + name).length != 1) {
        var codeType = 'css';
        if (/\.html/.test(name)) {
          codeType = 'html';
        } else if (/\.js/.test(name)) {
          codeType = 'js';
        }

        if (codeType == 'html') {
          editor.getSession().setMode('ace/mode/html');
        } else if (codeType == 'js') {
          editor.getSession().setMode('ace/mode/jsx');
        } else {
          editor.getSession().setMode('ace/mode/scss');
        }
        editor.getSession().setValue(data.data || '');
        state.fileName = fileName;
      }
    },
    error: AjaxError
  });
};

// 写页面
function writeHtml() {
  if (issubmit) {
    return;
  }
  issubmit = true;
  Loading.open();
  $.ajax({
    url: '/actions/build',
    dataType: 'json',
    data: mydata,
    success: function(data) {
      issubmit = false;
      Loading.close();
      if (data.code == '000000') {
        setPageUrl();
      } else {
        Toast.open('构建失败，请确保引用文件不被删除且无语法错误');
      }
    },
    error: AjaxError
  });
};

// 保存当前文件
function saveFile() {
  if (issubmit || state.fileName == null || state.fileName == '') {
    return;
  }
  issubmit = true;
  $.ajax({
    url: '/actions/saveFile',
    type: 'post',
    dataType: 'json',
    data: {
      name: mydata.name,
      frame: mydata.frame,
      fileName: state.fileName,
      content: ace.edit('editor').getSession().getValue()
    },
    success: function(data) {
      issubmit = false;
      if (data.code == '000000') {
        Toast.open('文件保存成功', 1000);
      } else {
        Toast.open(data.msg);
      }
    },
    error: AjaxError
  });
};

// 获取 url 参数值
function request(key) {
  var s = location.search.match(new RegExp('[?&]' + key + '=([^&]*)(&?)', 'i'));
  return (s == undefined || s == 'undefined' ? '' : s ? s[1] : s).replace(/[\<\>]/g, '');
};

// 添加文件文件夹
function addFile() {
  var fileName = $.trim($('#addFileName').val());
  if (issubmit || !chooseDirPath) {
    return;
  }
  if (fileName == null || fileName == '') {
    Toast.open(Reg.fileNameEmpty);
    return;
  }
  if (!Reg.checkFileName(fileName)) {
    Toast.open(Reg.fileNameError);
    return;
  }
  issubmit = true;
  Loading.open();
  $.ajax({
    url: '/actions/addFile',
    type: 'get',
    dataType: 'json',
    data: {
      frame: mydata.frame,
      name: mydata.name,
      filePath: chooseDirPath,
      fileName: fileName,
      fileType: $addFileType.val()
    },
    success: function(data) {
      issubmit = false;
      Loading.close();
      if (data.code != '000000') {
        Toast.open(data.msg);
      } else {
        var treeObj = $.fn.zTree.getZTreeObj('tree');
        treeObj.addNodes(chooseNode, {
          name: fileName,
          isParent: $addFileType.val() != 'file'
        });
        $dialogAdd.hide();
      }
    },
    error: AjaxError
  });
};

// 删除文件文件夹
function removeFile(node) {
  var result = false;
  var fileName = ztreeGetFilePath(node);
  if (fileName == null || fileName == '') {
    Toast.open('请选择要删除的文件文件夹');
    return result;
  }
  issubmit = true;
  Loading.open();
  $.ajax({
    url: '/actions/removeFile',
    async: false,
    dataType: 'json',
    data: {
      frame: mydata.frame,
      name: mydata.name,
      fileName: fileName,
      fileType: node.isParent ? 'dir' : 'file'
    },
    success: function(data) {
      issubmit = false;
      Loading.close();
      if (data.code != '000000') {
        Toast.open(data.msg);
      } else {
        result = true;
      }
    },
    error: AjaxError
  });

  return result;
};

// 绑定事件
function bindEvent() {
  // 执行结果
  $('#btnRun').on('click', function(event) {
    event.preventDefault();
    writeHtml();
  });

  // 切换项目
  $('#btnChange').on('click', function() {
    $dialogFrame.show();
  });

  // 保存文件
  $('#btnSave').on('click', function() {
    saveFile();
  });

  // 取消新增文件
  $('#btnAddCancel').on('click', function() {
    $dialogAdd.hide();
  });

  // 确定新增文件
  $('#btnAddOk').on('click', function() {
    addFile();
  });

  // 新建文件
  $('#btnAdd').on('click', function() {
    Toast.open('请双击树节点的文件夹');
  });

  // 选择项目
  $('#btnChooseProject').on('click', function() {
    find();
    $dialogFrame.hide();
  });

  $('#btnChooseCancle').on('click', function() {
    $dialogFrame.hide();
  });

  // 快捷键说明
  $('#btnKeycode').on('click', function() {
    Toast.open('<div>按两下 ctrl 执行构建</div><div>按一下 ctrl 再按一下 alt 执行文件保存</div>');
  });

  // 按下两次 ctrl 键执行 btnRun
  var isRun = false;
  $(document).on('keyup', function(e) {
    var num = e.keyCode;
    if (num == 17) {
      if (isRun) {
        writeHtml();
        isRun = false;
      }
      isRun = true;
    } else if (num == 18) {
      if (isRun) {
        saveFile();
        isRun = false;
      }
    } else {
      isRun = false;
    }
  });
};

function AjaxError() {
  issubmit = false;
  Loading.close();
  Toast.open('网络连接失败');
};

$(function() {
  init();
  bindEvent();
});
