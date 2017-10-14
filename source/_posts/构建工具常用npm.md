---
title: 构建常用npm包
date: 2017-10-05
categories: 前端工程
tags: npm包
toc: true
---
# 前言
最近看到一篇文章《[迷茫时学习Node.js最好的方法](http://cnodejs.org/topic/59c75a3dd7cbefc511964688)》
一直以来对node的个人心理倾向于做前端工具，而不是web服务。所以一直以来都没好好学node。

# 基础配置

## 1.html-webpack-plugin

为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题

可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');// 删除目录插件
const ManifestPlugin = require('webpack-manifest-plugin');// 输出配置

module.exports = {
    entry: {
      app: './src/index.js',
      vendor: ['lodash']
    },
    // 虽然在 dist/ 文件夹我们已经有 index.html 这个文件，然而 HtmlWebpackPlugin 还是会默认生成 index.html 文件。
    // 这就是说，它会用新生成的 index.html 文件，把我们的原来的替换。
    plugins: [
      new ManifestPlugin({
          fileName: 'my-manifest.json',
          basePath: '/app/',
          seed: {
            name: 'My Manifest'
          }
      }),
      new CleanWebpackPlugin(['dist']),  
      new HtmlWebpackPlugin({
        title: 'output manger',
        filenameL: 'index.html',
        template: 'src/index.html'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
};
```
## 2. [html-loader](https://doc.webpack-china.org/loaders/html-loader)

## 3. autoprefixer-loade

Autoprefixer是一个后处理程序，你可以同Sass，Stylus或LESS等预处理器共通使用。它适用于普通的CSS，而你无需关心要为哪些浏览器加前缀，只需全新关注于实现，并使用W3C最新的规范。

## 4. file-loader

file-loader的主要功能是：把源文件迁移到指定的目录（可以简单理解为从源文件目录迁移到build目录），并返回新文件的路径（简单拼接而成）。

## 5. url-loader

url-loader的主要功能是：将源文件转换成DataUrl(声明文件mimetype的*base64编码*)。据我所知，在前端范畴里，图片和字体文件的DataUrl都是可以被浏览器所识别的，因此可以把图片和字体都转化成DataUrl收纳在HTML/CSS/JS文件里，以减少HTTP连接数。

图片

```javascript
 {
    // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
    // 如下配置，将小于8192byte的图片转成base64码
    test: /\.(png|jpg|gif)$/,
    loader: 'url-loader?limit=8192&name=./static/img/[hash].[ext]',
 },
```
字体文件

```javascript
 {
    // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
    test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
    loader: 'file?name=./static/fonts/[name].[ext]',
 },
```

## 6. css-loader

针对css文件，我们需要使用css-loader来加载.css-loader的功能比较强大，一些新颖的特性比如Local Scope或是CSS Modules都是支持的。

## 7. less-loader

针对less文件，我们首先需要使用less-loader来加载。less-loader会调用所依赖的less模块对less文件进行编译(包括@import语法)。至于说less-loader所接受的参数，实质上大部分是传递给less模块使用的参数，由于我本人应用less的程度不深，因此没有传任何参数、直接就使用了。如果你之前对less模块就已经有了一套配置的话，请参考[less-loader的文档][3]进行配置。

另外，less-loader并不会针对url()语法做特别的转换，因此，如果你想把*url()语句里涉及到的文件（比如图片、字体文件等*）也一并用webpack打包的话，就必须*利用管道交给css-loader*做进一步的处理。

## 8. [ExtractTextWebpackPlugin](https://doc.webpack-china.org/plugins/extract-text-webpack-plugin)

```
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ]
}
```

它会将所有的入口 chunk(entry chunks)中引用的 **.css*，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 *JS bundle* 中，而是会放到一个单独的 CSS 文件（即 styles.css）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle* 并行加载*。

[http://array_huang.coding.me/webpack-book/chapter3/webpack-with-babel.html](http://array_huang.coding.me/webpack-book/chapter3/webpack-with-babel.html)
## 9. babel相关
1.babel-core 

babel的核心

2.babel-preset-es2015-loose
  || babel-preset-es2015
  
  尽可能符合ECMAScript6语义的*normal模式*和提供更简单ES5代码的*loose模式*
  
3.babel-loader

babel转化loader
```json
    {
      test: /\.js$/,
      exclude: /node_modules|vendor|bootstrap/,
      loader: 'babel-loader?presets[]=es2015-loose&cacheDirectory&plugins[]=transform-runtime',
    },
```

*cacheDirectory* cacheDirectory参数默认为false，若你设置为一个文件目录路径（表示把cache存到哪），或是保留为空（表示操作系统默认的缓存目录），则相当于开启cache。这里的cache指的是babel在编译过程中某些可以缓存的步骤，具体是什么我也不太清楚，反正是只要开启了cache就可以加快webpack整体编译速度


4.babel-plugin-transform-runtime和5.babel-runtime

虽说一个preset已经包括N个plugin了，但总有一些漏网之鱼是要专门加载的。这里我只用到了transform-runtime，这个plugin的效果是：不用这plugin的话，babel会为每一个转换后的文件（在webpack这就是每一个chunk了）都添加一些辅助的方法（仅在需要的情况下）；而如果用了这个plugin，babel会把这些辅助的方法都集中到一个文件里统一加载统一管理，算是一个减少冗余，增强性能的优化项吧，用不用也看自己需要了；如果不用的话，前面也不需要安装babel-plugin-transform-runtime和babel-runtime了。

5.babel-preset-stage-3

js 提案语法第三阶段
```
{
   "presets": ["es2015", "stage-3"],
   "plugins": ["transform-runtime"],
   "comments": false    
}
```
*未来的babel*
[再见，babel-preset-2015](https://zhuanlan.zhihu.com/p/29506685?group_id=893878108275478528)

## 10. gulp相关
```json
"gulp": "^3.9.1",
"gulp-autoprefixer": "^3.1.1",
"gulp-clean-css": "^2.0.13",
"gulp-less": "^3.3.2",
"gulp-rename": "^1.2.2"
```

# 工程
## 1. friendly-errors-webpack-plugin 
错误信息提示插件
## 2. cross-env 
跨操作系统 在ENV 前加 cross-env
```json
"unit": "cross-env BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
```
## 3. 配置文件
1. [.babelrc](https://excaliburhan.com/post/babel-preset-and-plugins.html) 
```json
{
    "presets": ["es2015", "stage-3"], //转化代码版本
    "plugins": ["transform-runtime"],
    "comments": false
}

```
2. [EditorConfig](http://www.alloyteam.com/2014/12/editor-config/)

```json
root = true

charset = utf-8
indent_style = space
indent_size = 4
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

```

3. [.attributes](https://git-scm.com/book/zh-tw/v1/Git-%E5%AE%A2%E8%A3%BD%E5%8C%96-Git-%E5%B1%AC%E6%80%A7)
```json
src/styles/**/* linguist-vendored=false
```
4. [.npmignore](http://front-ender.me/architecture/npmignore.html)
 
 ```
.*
*.md
*.yml
build/
node_modules/
test/
gulpfile.js

 ```
5. [.travis.yml](http://www.cnblogs.com/huang0925/archive/2013/05/30/3108370.html)
 ```json
 language: node_js
 node_js:- "4"
script:- npm run test

 ```
## 优化
1. dll
2. happypack
多线程

