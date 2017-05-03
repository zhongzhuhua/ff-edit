console.log('index');
import '../css/index.scss';
$.ajax({
  url: global.api + 'index.json',
  dataType: 'json',
  success: function(data) {
    console.log(data);
  }
});
