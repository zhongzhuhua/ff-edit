// 路由器，默认有如下配置，如果删除了，也会有
exports.default = {
  // index.html 带有 vendor.js 和 index.js 还有 index.css
  'index': {
    chunks: ['vendor', 'index'],
    css: 'index'
  }
};
