---
title: js异步编程
date: 2017-10-07
categories: js
tags: js，js基础
toc: true
---
任何可以用JavaScript写成的应用，最终都会用JavaScript写。

# 回调地狱
![image](http://ou3alp906.bkt.clouddn.com/%E5%9B%9E%E8%B0%83.jpg)

# 重点

```js
func(function(arg) {return next(arg);});

func(next);
```

# PubSub 模式

```js
['room', 'moon', 'jump to room'].forEach(function(name){
  process.on('exit', function() {
    console.log('Goodnight,', name);
  });
});
```

实现一个 PubSub

```js
// 唯一需要存储的状态值就是一个时间处理器的清单
PubSub = {handlers: {}};

//  需要添加事件处理器时， 只要将监听器推入数组末尾即可。（这意味着会总会按照添加监听器）
PubSub.on = function(eventType, handler) {
  if(!(eventType in this.handler)) {
    this.handlers[eventType] = [];
  }
  this.handlers[eventType].push(handler);
  return this;
}

// 事件触发的时候，循环遍历所有的事件处理器

PubSub.emit = function(eventType) {
  var handlerArgs = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < this.handlers[eventType].length; i++) {
    this.handlers[eventType][i].apply(this, handleArgs);
  }
  return this;
}
```

# promise


> Promise 对象用于一个异步操作的最终完成（或失败）及其结果值的表示。(简单点说就是处理异步请求。我们经常会做些承诺，如果我赢了你就嫁给我，如果输了我就嫁给你之类的诺言。这就是promise的中文含义：诺言，一个成功，一个失败。) -MDN

```javascript
new Promise(
    /* executor */
    function(resolve, reject) {...}
);
```

一个 Promise有以下几种状态:

+ pending: 初始状态，不是成功或失败状态。
+ fulfilled: 意味着操作成功完成。
+ rejected: 意味着操作失败。

## then()
```javascript
  var promise = new Promise(function(resolve, reject){
      resolve("传递给then的值");
  });
  promise.then(function (value) {
      console.log(value);
  }, function (error) {
      console.error(error);
  });
```
## catch() 
捕获promise 运行的各种错误 promise.then(undefined, onRejected)
的语法糖

```javascript
var promise = new Promise(function(resolve, reject){
    resolve("传递给then的值");
});
promise.then(function (value) {
    console.log(value);
}).catch(function (error) {
    console.error(error);
});
```
## Promise.resolve &&  Promise.reject


## Promise.all


生成并返回一个新的promise对象。

参数传递promise数组中所有的promise对象都变为resolve的时候，该方法才会返回， 新创建的promise则会使用这些promise的值。

如果参数中的任何一个promise为reject的话，则整个Promise.all调用会立即终止，并返回一个reject的新的promise对象。

由于参数数组中的每个元素都是由 Promise.resolve 包装（wrap）的，所以Paomise.all可以处理不同类型的promose对象。

```javascript
var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);
Promise.all([p1, p2, p3]).then(function (results) {
    console.log(results);  // [1, 2, 3]
});
```

## Promise.race

```javascript
var p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = Promise.resolve(3);
Promise.race([p1, p2, p3]).then(function (value) {
    console.log(value);  // 1
});
```
生成并返回一个新的promise对象。

参数 promise 数组中的任何一个promise对象如果变为resolve或者reject的话， 该函数就会返回，并使用这个promise对象的值进行resolve或者reject。



# 参考
[JavaScript Promise迷你书（中文版）](http://liubin.org/promises-book/)

promise阮一峰(http://javascript.ruanyifeng.com/advanced/promise.html)