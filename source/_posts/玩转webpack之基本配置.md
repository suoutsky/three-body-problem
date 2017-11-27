---
title: 玩转webpack之基本配置
date: 2017-10-05
categories: js
tags: webpack
toc: true
---
# 前言

Node开发离不开 npm, npm init 会为我们当前目录新建一个package.json。

```json
  "scripts": {
    "dev": "node builds/dev-server.js",
    "remove-dist": "node builds/rmdir.js",
    "build": "npm run buildc",
    "build-dll": "webpack --config builds/webpack.dll.conf.js",
    "buildc": "npm run remove-dist && npm run build-dll && node builds/build.js",
    "unit": "karma start test/unit/karma.conf.js --single-run",
    "e2e": "node test/e2e/runner.js",
    "test": "npm run unit && npm run e2e",
    "lint": "eslint --fix --ext .js,.vue src test/unit/specs test/e2e/specs"
  }
```

然而你真的了解package.json吗，
建议好好看阮一峰老师的[npm scripts 使用指南](http://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)

# webpack主要配置