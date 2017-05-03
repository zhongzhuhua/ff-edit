// 常用配置
exports.cfgs = {
  // 打包之后要不要保留 console.log
  log: true,
  // 要不要打包 mock 数据
  mock: true
};

// 入口脚本配置
exports.js = {
  'vendor': './vendor.js',
  'index': './js/index.js'
};

// html 页面配置
exports.html = {
  // index.html 带有 vendor.js 和 index.js 还有 index.css
  'index': {
    chunks: ['vendor', 'index'],
    css: 'index'
  },
  'views/main': {
    chunks: ['vendor'],
    css: 'main'
  },
  'views/user': {
    chunks: ['vendor'],
    css: 'user'
  }
};
