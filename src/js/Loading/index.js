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

  }, 20000);
};

exports.close = function() {
  setTimeout(function() {
    show = false;
    $loading.hide();
    clearTimeout(timer);
  }, 500);
};
