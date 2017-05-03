var del = require('del');
var webpack = require('webpack');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var nodeProject = process.env.nodeProject || 'demo';
del.sync('./dist/' + nodeProject);

// 获取配置文件
var userConfigs = require('./src/' + nodeProject + '/configs');

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

var cfgs = userConfigs.cfgs || { log: false, mock: true };
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

// mock 数据复制
if (cfgs.mock) {
  plugins.push(new TransferWebpackPlugin([{
    from: './src/' + nodeProject + '/mock',
    to: './mock'
  }], __dirname));
}

// 配置是否热更新，是否需要 demo
var entryMap = {
  'vendor': ['react', 'react-dom', 'react-router', 'react-router-dom', 'reqwest'],
  'index': ['./index.js']
};
plugins.push(new webpack.optimize.CommonsChunkPlugin(['vendor']));

// 配置出口文件
var pluginsHtml = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: __dirname + '/src/' + nodeProject + '/index.html',
  inject: 'body',
  chunks: ['vendor', 'index']
});
plugins.push(pluginsHtml);

// 环境变量
plugins.push(new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
}));

module.exports = {
  // 跟目录
  context: __dirname + '/src/' + nodeProject,

  // 插件
  plugins: plugins,

  // 脚本入口文件配置
  entry: entryMap,

  // 脚本文件输出配置
  output: {
    filename: '[name].[chunkhash:8].js',
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
      loader: 'url-loader?limit=8192&name=img/[name].[chunkhash:4].[ext]'
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: 'style-loader!css-loader!sass-loader!postcss-loader'
    }]
  }
};
