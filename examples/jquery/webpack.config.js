var del = require('del');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var nodeProject = process.env.nodeProject || 'demo';
del.sync('./dist/' + nodeProject);

// 获取配置文件
var userConfigs = require('./src/' + nodeProject + '/configs');
var htmlConfigs = {};
var entryConfigs = {};
if (userConfigs.html == null) {
  htmlConfigs = {};
} else {
  htmlConfigs = userConfigs.html;
}
if (htmlConfigs['index'] == null) {
  htmlConfigs.index = {
    chunks: ['vendor'],
    css: 'index'
  }
}
if (userConfigs.js == null) {
  entryConfigs = {};
} else {
  entryConfigs = userConfigs.js;
}
if (entryConfigs['vendor'] == null) {
  entryConfigs.vendor = {
    'vendor': './vendor.js'
  }
}

// 配置入口文件
var plugins = [];

// autoprefixer
plugins.push(new webpack.LoaderOptionsPlugin({
  options: {
    postcss: function() {
      return [require('autoprefixer')];
    }
  }
}));

var cfgs = userConfigs.cfgs || { log: false };
var uglifyPlug = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false,
    drop_console: !cfgs.log
  },
  output: {
    comments: false,
  }
});
plugins.push(uglifyPlug);

plugins.push(new ExtractTextPlugin('css/[name].[chunkhash:6].css'));

// 配置 html 文件
for (var key in htmlConfigs) {
  plugins.push(new HtmlWebpackPlugin({
    filename: key + '.html',
    template: __dirname + '/src/' + nodeProject + '/' + key + '.html',
    inject: 'body',
    chunks: htmlConfigs[key]['chunks'],
    minify: {
      // 去掉注释
      removeComments: true,
      // 去掉空格
      collapseWhitespace: true,
      // 删除标签上的引号
      removeAttributeQuotes: true
    }
  }));
}

// 配置 entryMap 入口脚本
var entryMap = {};
for (var key in entryConfigs) {
  entryMap[key] = entryConfigs[key];
}
plugins.push(new webpack.optimize.CommonsChunkPlugin(['vendor']));

module.exports = {
  // 跟目录
  context: __dirname + '/src/' + nodeProject,

  // 插件
  plugins: plugins,

  // 脚本入口文件配置
  entry: entryMap,

  // 脚本文件输出配置
  output: {
    filename: 'js/[name].[chunkhash:6].js',
    path: __dirname + '/dist/' + nodeProject + '/'
  },

  module: {
    loaders: [{
      test: /\.(js)?$/,
      exclude: /node_modules/,
      loader: 'babel-loader?compact=false&presets[]=es2015&presets[]=react&presets[]=stage-2'
    }, {
      test: /\.(jpe?g|gif|png|ico|svg)$/,
      exclude: /node_modules/,
      loader: 'url-loader?limit=8192&name=img/[name].[hash:4].[ext]'
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader!sass-loader!postcss-loader'
    }]
  }
};
