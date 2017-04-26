import './index.scss';

var $toast = $('<div class="c-toast"></div>');
$('body').append($toast);

var show = false;
var timer = null;
exports.open = function(msg) {
  if (show) {
    return;
  }
  show = true;
  $toast.show();
  $toast.html(msg);
  timer = setTimeout(function() {
    show = false;
    $toast.hide();
  }, 3000);
};

exports.close = function() {
  show = false;
  $toast.hide();
  clearTimeout(timer);
};
