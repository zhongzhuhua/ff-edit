import './index.scss';

var $loading = $('<div class="c-loading"><div class="main"><div class="img"></div></div></div>');
$('body').append($loading);

var show = false;
var timer = null;
exports.open = function() {
  if (show) {
    return;
  }
  show = true;
  $loading.show();
  timer = setTimeout(function() {
    show = false;
    $loading.hide();
    alert('网络连接超时');
  }, 20000);
};

exports.close = function() {
  show = false;
  $loading.hide();
  clearTimeout(timer);
};
