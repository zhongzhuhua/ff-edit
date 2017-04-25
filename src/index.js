import './index.scss';
import Loading from './js/Loading';

// 是否正在提交中
var issubmit = false;
// 当前操作的文件
var state = {
  fileName: ''
};
// 初始化插件
var $dialogFrame = $('#dialogFrame');
// var editor = ace.edit('editor');
var $codeEditor = $('#codeEditor');
var $frame = $('#frame');
var $name = $('#name');
var $code = $('#code');
var $content = $('#content');

function init() {
  // 创建编辑器
  ace.require('ace/ext/language_tools');
  // editor.setTheme('ace/theme/crimson-editor');
  var frame = request('frame');
  var name = request('name');
  if (frame != '') {
    $frame.val(request('frame'));
  }
  $name.val(request('name'));
  find();
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
        $.fn.zTree.init($('#tree'), {
          data: {
            simpleData: {
              enable: true
            },
            keep: {
              leaf: true,
              parent: true
            }
          },
          callback: {
            onClick: function(event, treeId, treeNode) {
              if (treeNode && !treeNode.isParent) {
                getFile(treeNode.key);
              }
            }
          }
        }, nodes);
        setPageUrl();
      }
    },
    error: function() {
      issubmit = false;
      Loading.close();
    }
  });
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
  console.log(time);
  $content.attr('src', link.indexOf('?') == -1 ? (link + '?' + time) : (link + time));
};

// 获取文件内容
function getFile(fileName) {
  if (issubmit || fileName == null || fileName == '' || fileName.indexOf('.') < 1) {
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

        // var clazz = 'code ' + ($frame.val().indexOf('react') > -1 ? 'react' : '') + ' code-' + codeType;
        // $codeEditor.attr('class', clazz);
        $code.html($('<div id="editor" class="code ' + ($frame.val().indexOf('react') > -1 ? 'react' : '') + ' code-' + codeType + '"></div>'));
        var editor = ace.edit('editor');
        editor.setTheme('ace/theme/crimson-editor');
        if (codeType == 'html') {
          editor.getSession().setMode('ace/mode/html');
          editor.setOptions({
            enableBasicAutocompletion: true,
            indent_size: 2
          });
        } else if (codeType == 'js') {
          editor.getSession().setMode('ace/mode/javascript');
          editor.setOptions({
            enableBasicAutocompletion: true,
            indent_size: 2
          });
        } else {
          editor.getSession().setMode('ace/mode/scss');
          editor.setOptions({
            enableBasicAutocompletion: true,
            indent_size: 2
          });
        }
        editor.getSession().setValue(data.data || '');
        state.fileName = fileName;
      }
    },
    error: function() {
      issubmit = false;
      Loading.close();
    }
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
    url: '/actions/opeBuild',
    dataType: 'json',
    data: mydata,
    success: function(data) {
      issubmit = false;
      Loading.close();
      if (data.code == '000000') {
        setPageUrl();
      }
    },
    error: function() {
      issubmit = false;
      Loading.close();
    }
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
      console.log(data);
    },
    error: function() {
      issubmit = false;
    }
  });
};

// 获取 url 参数值
function request(key) {
  var s = location.search.match(new RegExp('[?&]' + key + '=([^&]*)(&?)', 'i'));
  return (s == undefined || s == 'undefined' ? '' : s ? s[1] : s).replace(/[\<\>]/g, '');
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

  // 选择项目
  $('#btnChooseProject').on('click', function() {
    find();
    $dialogFrame.hide();
  });

  $('#btnChooseCancle').on('click', function() {
    $dialogFrame.hide();
  });

  // 按下两次 ctrl 键执行 btnRun
  var isRun = false;
  $(document).on('keyup', function(e) {
    console.log(e);
    var num = e.keyCode;
    if (num == 17) {
      if (isRun) {
        writeHtml();
        isRun = false;
      }
      isRun = true;
    } else {
      isRun = false;
    }
  });
};

$(function() {
  init();
  bindEvent();
});
