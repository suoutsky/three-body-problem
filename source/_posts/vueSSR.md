---
title: Vue预加载
date: 2017-12-05
categories: vue
tags: vue
toc: true
---
# 前言

SEO 一直是spa页面的痛点。从头搭建一个服务端渲染的应用是相当复杂的。 Nuxt.js 让这一切变得非常简单。Nuxt 是一个基于 Vue 生态的更高层的框架，为开发服务端渲染的 Vue 应用提供了极其便利的开发体验。更酷的是，你甚至可以用它来做为静态站生成器。
而Vue 也提供了解决方案

```javascript
npm install vue vue-server-renderer --save
```

# 基本用法

```html
<html>
  <head>
    <!-- 使用双花括号(double-mustache)进行 HTML 转义插值(HTML-escaped interpolation) -->
    <title>{{ title }}</title>
    <!-- 使用三花括号(triple-mustache)进行 HTML 不转义插值(non-HTML-escaped interpolation) -->
    {{{ meta }}}
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

```js
// 模板页面
const renderer = createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})

const context = {
  title: 'hello',
  meta: `
    <meta ...>
    <meta ...>
  `
}
// 渲染模板
renderer.renderToString(app, context, (err, html) => {
  // page title will be "Hello"
  // with meta tags injected
})
```

# 组件生命周期

由于没有动态更新，所有的生命周期钩子函数中，只有 `beforeCreate` 和 `created` 会在服务器端渲染(SSR)过程中被调用。这就是说任何其他生命周期钩子函数中的代码（例如 `beforeMount` 或 `mounted`），只会在客户端执行。

不能在`beforeCreate` 和 `created`中使用副作用代码。
