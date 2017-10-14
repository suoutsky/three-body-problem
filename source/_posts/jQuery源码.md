---
title: 了解js异步同步
date: 2015-10-07 08:55:29
categories: js
tags: js
toc: true
---
通过new操作符构建一个对象，一般经过四步：

  A.创建一个新对象

  B.将构造函数的作用域赋给新对象（所以this就指向了这个新对象）

  C.执行构造函数中的代码

  D.返回这个新对象

最后一点就说明了，我们只要返回一个新对象即可。其实new操作符主要是把原型链跟实例的this关联起来，这才是最关键的一点，所以我们如果需要原型链就必须要new操作符来进行处理。否则this则变成window对象了。

>jQuery的这个结构

```javascript
var $$ = ajQuery = function(selector) {
    this.selector = selector;
    return this
}
ajQuery.fn = ajQuery.prototype = {
    selectorName:function(){
        return this.selector;
    },
    constructor: ajQuery
}
var a = new $$('aaa');  //实例化
a.selectorName() //aaa //得到选择器名字
```
> 首先改造jQuery无new的格式，我们可以通过instanceof判断this是否为当前实例：

```javascript
var $$ = ajQuery = function(selector) {
    if(!(this instanceof ajQuery)){
        return new ajQuery(selector);
    }
    this.selector = selector;
    return this
}
```