import './index.scss';

// 是否正在写入代码
var running = false;
// 初始化插件
// var htmlEditor = ace.edit('html');
// var cssEditor = ace.edit('css');
// var jsEditor = ace.edit('js');
var $example = $('#example');

function init() {
  // 创建编辑器
  ace.require('ace/ext/language_tools');

  // htmlEditor.setTheme('ace/theme/crimson-editor');
  // htmlEditor.getSession().setMode('ace/mode/html');
  // htmlEditor.setOptions({
  //   enableBasicAutocompletion: true
  // });

  // cssEditor.setTheme('ace/theme/crimson-editor');
  // cssEditor.getSession().setMode('ace/mode/css');
  // cssEditor.setOptions({
  //   enableBasicAutocompletion: true
  // });

  // jsEditor.setTheme('ace/theme/crimson-editor');
  // jsEditor.getSession().setMode('ace/mode/javascript');
  // jsEditor.setOptions({
  //   enableBasicAutocompletion: true
  // });
};

// 绑定 Tab 点击事件
function tab() {
  var $domCode = $('#code');
  var $domCodeDivs = $domCode.find('>.code');
  $('#nav >div').on('click', function() {
    $('#nav .choose').removeClass('choose');
    $(this).addClass('choose');
    var val = $(this).attr('data-value');
    $domCodeDivs.css('height', '0');
    $(document.getElementById(val)).css('height', '100%');
  });
};

// 请求数据
var headContent = '';

function find() {
  var name = request('name');
  var example = $example.val();
  $.ajax({
    url: '/actions/findByName',
    dataType: 'json',
    data: {
      name: name,
      example: example
    },
    success: function(data) {
      if (data.code == '000000') {
        data = data.data;
        var project = data.name;
        var files = data.files;
        var jsContent = files[project + '/index.js'];
        var cssContent = files[project + '/index.css'];
        var htmlContent = files[project + '/index.html'];
        headContent = getBody(getHead(htmlContent));
        var bodyContent = style_html(getBody(htmlContent), {
          indent_size: 2
        });

        console.log(files);
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
                alert(project);
                alert(treeNode.key);
              }
            }
          }
        }, nodes);

        // htmlEditor.getSession().setValue(bodyContent);
        // jsEditor.getSession().setValue(jsContent);
        // cssEditor.getSession().setValue(cssContent);
        writeHtml();
      }
    }
  });
};

// 写页面
function writeHtml() {
  // var previewDoc = window.frames[0].document;

  // var css = ace.edit('css').getSession().getValue();
  // var script = ace.edit('js').getSession().getValue();
  // var html = ace.edit('html').getSession().getValue();
  // var example = $example.val();
  // var framesType = 'text/javascript';
  // if (example.indexOf('react') >= -1) {
  //   framesType = 'text/babel';
  //   $('#js').addClass('react');
  // } else {
  //   $('#js').removeClass('react');
  // }

  // previewDoc.write('<!DOCTYPE html>');
  // previewDoc.write('<html>');
  // previewDoc.write(headContent);
  // previewDoc.write('<style type="text/css">' + css + '</style>');
  // previewDoc.write('<body>');
  // previewDoc.write(html);
  // previewDoc.write('</body>');
  // previewDoc.write('<script type="' + framesType + '">' + script + '</script>');
  // previewDoc.write('</html>');
  // previewDoc.close();
  // running = false;
};

// 获取 head 内容
var regHead = /<head[^>]*>([\s\S]*)<\/head>/;

function getHead(content) {
  var result = regHead.exec(content);
  if (result && result.length === 2)
    return result[1];
  return content;
};

// 获取 body 内容
var regBody = /<body[^>]*>([\s\S]*)<\/body>/;

function getBody(content) {
  var result = regBody.exec(content);
  if (result && result.length === 2)
    return result[1];
  return content;
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
    if (running) return;
    running = true;
    event.preventDefault();
    writeHtml();
  });

  // 选择框架
  $example.on('change', function() {
    find();
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
  tab();
  find();
  bindEvent();
});
