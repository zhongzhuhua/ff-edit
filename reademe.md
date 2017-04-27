# react

## 环境搭建，建议使用系统自带终端

    需要 nodejs v6.2.0 以上版本
    npm install
    npm start 或者 node server.js


## 代码规范

    * 统一使用 webpack 推荐语法，不考虑迁移，不用 cmd 和 amd 规范
    * [()] run();  (function(){})(); 小括号后除数组内的，配置内的无法加，其他的建议加 ;
    * function() {}; 结尾建议加 ;
    * return {}; 结尾建议加 ;
    * 以 ' 未基础字符串号，   var name = '"This is demo"';
    * 每个 function 后回车一行，如果有参数的，建议复杂参数打上注释
    * 目前可以考虑以 es6 为标准，这个每个项目组自己取舍
    * Tab 键按照 2个空格来处理


## 目录结构

```
|actions                    -- 接口请求
|components                 -- 组件，nodejs 和 前端页面公用
|examples                   -- demo 开发目录 
|public                     -- 公用静态文件
|server                     -- 后端公用代码工具类
.gitignore                  -- git 忽略配置
.jsbeautifyrc               -- 格式化插件配置文件，sublime html/css/js prettify 专用
.npmrc                      -- 下载插件指定服务器
browserslist                -- autoprefixer 样式自动补全版本
readme.md                   -- 项目使用基础文档
package.json                -- 项目配置和依赖
server.js                   -- 项目启动文件
test.js                     -- 测试 nodejs 文件
webpack.config.js           -- webpack 打包配置文件

```