var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var configs = {
  nodeEnv: process.env.nodeEnv
};

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

// 配置是否热更新，是否需要 demo
var entryMap = {
  'index': ['./index.js']
};

if (configs.nodeEnv == 'dev') {
  plugins.push(new webpack.HotModuleReplacementPlugin());
  entryMap.index = ['webpack-hot-middleware/client?reload=true', './index.js'];
}

// 配置出口文件
var pluginsHtml = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: __dirname + '/src/index.html',
  inject: 'body',
  chunks: ['index']
});
plugins.push(pluginsHtml);

module.exports = {
  // 跟目录
  context: __dirname + '/src',

  // 插件
  plugins: plugins,

  // 脚本入口文件配置
  entry: entryMap,

  // 脚本文件输出配置
  output: {
    filename: '[name].[hash:6].js',
    path: __dirname + '/dist/'
  },

  module: {
    loaders: [{
      test: /\.(js)?$/,
      exclude: /node_modules/,
      loader: 'babel-loader?compact=false&presets[]=es2015&presets[]=stage-2'
    }, {
      test: /\.(jpe?g|gif|png|ico|svg)$/,
      exclude: /node_modules/,
      loader: 'url-loader?limit=8192&name=img/[name].[hash:4].[ext]'
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader!sass-loader!postcss-loader'
    }]
  },
  // 调试 map ，方便 es6 调试
  devtool: 'source-map'
};
