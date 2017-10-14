---
title: js异同步
date: 2017-10-07
categories: js
tags: js异同步
toc: true
---
# 前言
回调地狱
![image](http://ou3alp906.bkt.clouddn.com/%E5%9B%9E%E8%B0%83.jpg)

# js异步
Javascript 语言的执行环境是“单线程”（single thread）。所谓“单线程”，就是指一次只能完成一件任务。如果有多个任务，就必须排队，前面一个任务完成，再执行后面一个任务。

这种模式的好处是实现起来比较简单，执行环境相对单纯；坏处是只要有一个任务耗时很长，后面的任务都必须排队等着，会拖延整个程序的执行。常见的浏览器无响应（假死），往往就是因为某一段 JavaScript 代码长时间运行（比如死循环），导致整个页面卡在这个地方，其他任务无法执行。

为了解决这个问题，Javascript 语言将任务的执行模式分成两种：同步（Synchronous）和异步（Asynchronous）。
## 回调函数

假定有两个函数f1和f2，后者必须等到前者执行完成，才能执行。这时，可以考虑改写f1，把f2写成f1的回调函数。
```javascript
  function f1(callback) {
      callback();
  }
```
## 事件监听

```javascript
f1.on('done', f2);

function f1(){
  setTimeout(function () {
    // f1的任务代码
    f1.trigger('done');
  }, 1000);
}
```
## 发布订阅
```javascript
jQuery.subscribe("done", f2);

function f1(){
	setTimeout(function () {
		// f1的任务代码
		jQuery.publish("done");
	}, 1000);
}

jQuery.unsubscribe("done", f2);
```
这种方法的性质与”事件监听”类似，但是明显优于后者。因为我们可以通过查看”消息中心”，了解存在多少信号、每个信号有多少订阅者，从而监控程序的运行。
# js异步操作流程控制
如果有多个异步操作，就存在一个流程控制的问题：确定操作执行的顺序，以后如何保证遵守这种顺序
```javascript
function async(arg, callback) {
  console.log('参数为 ' + arg +' , 1秒后返回结果');
  setTimeout(function() { callback(arg * 2); }, 1000);
}
```
上面代码的async函数是一个异步任务，非常耗时，每次执行需要1秒才能完成，然后再调用回调函数。

如果有6个这样的异步任务，需要全部完成后，才能执行下一步的final函数。
```javascript
function final(value) {
  console.log('完成: ', value);
}
```
请问应该如何安排操作流程？
```javascript
async(1, function(value){
  async(value, function(value){
    async(value, function(value){
      async(value, function(value){
        async(value, function(value){
          async(value, final);
        });
      });
    });
  });
});
```
上面代码采用6个回调函数的嵌套，不仅写起来麻烦，容易出错，而且难以维护

## 串行执行
我们可以编写一个流程控制函数，让它来控制异步任务，一个任务完成以后，再执行另一个。这就叫串行执行。（任务队列）

```javascript
 let taskQueen = [1, 2, 3, 4, 5, 6];
 let result = [];
 function invoke(curTask) {
    if (curTask) {
      console.log('当前正在执行任务', curTask);
      result.push(curTask + '完成');
    } else {
      console.log('当前任务全部完成');
    }
 }
 invoke(taskQueen.shift());
```
```javascript
var items = [ 1, 2, 3, 4, 5, 6 ];
var results = [];
function series(item) {
  if(item) {
    async( item, function(result) {
      results.push(result);
      return series(items.shift());
    });
  } else {
    return final(results);
  }
}
series(items.shift());
```

## 并行
```javascript
    var items = [ 1, 2, 3, 4, 5, 6 ];
    var results = [];
    items.forEach(function(item) {
      async(item, function(result){
        results.push(result);
        if(results.length == items.length) {
          final(results);
        }
      })
    });
```
上面代码中，forEach方法会同时发起6个异步任务，等到它们全部完成以后，才会执行final函数。

并行执行的好处是效率较高，比起串行执行一次只能执行一个任务，较为节约时间。但是问题在于如果并行的任务较多，很容易耗尽系统资源，拖慢运行速度。因此有了第三种流程控制方式

```javascript
function launcher() {
  while(running < limit && items.length > 0) {
    var item = items.shift();
    async(item, function(result) {
      results.push(result);
      running--;
      if(items.length > 0) {
        launcher();
      } else if(running == 0) {
        final(results);
      }
    });
    running++;
  }
}

launcher();
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
##  Promise.resolve &&  Promise.reject
##  Promise.all
生成并返回一个新的promise对象。

参数传递promise数组中所有的promise对象都变为resolve的时候，该方法才会返回， 新创建的promise则会使用这些promise的值。

如果参数中的任何一个promise为reject的话，则整个Promise.all调用会立即终止，并返回一个reject的新的promise对象。

由于参数数组中的每个元素都是由 Promise.resolve 包装（wrap）的，所以Paomise.all可以处理不同类型的promose对象。
```
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