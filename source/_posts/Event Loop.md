---
title: EventLoop
date: 2016-10-07
categories: js
tags: js
toc: true
---

# 前言

最近遇到几次事件相关bug,正好借此机会重新完整的整理下事件相关知识

+ [手机端事件绑定问题 $('body').on('click', '.egg', function() {}); ](https://github.com/suoutsky/stepping-stone/issues/1)
+ [Vue.js 升级踩坑小记](https://juejin.im/post/5a1af88f5188254a701ec230)

+  `evt.initEvent("click", false, false);` 主动触发 ` aLink.dispatchEvent(evt);`

```js
function downloadFile(fileName, content){
    var aLink = document.createElement('a');
    var blob = new Blob([content]);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
    aLink.download = fileName;
    aLink.href = URL.createObjectURL(blob);
    // 主动触发事件，模拟点击
    aLink.dispatchEvent(evt);
}
```

# 单线程的javascript

为什么JavaScript是单线程？ 参考阮一峰老师的[JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

> js的单线程与它的用途有关，作为浏览器脚本语言，JavaScript的主要用途是与用户互动，以及操作DOM。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定JavaScript同时有两个线程，一个线程在某个DOM节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？

# 任务队列

单线程就意味着，所有任务需要`排队`，前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个任务就不得不一直等着。

`队列`是遵循FIFO(First In First Out,先进先出,也称为先来先服务)原则的一组有序的

> 所有任务可以分成两种，一种是`同步任务（synchronous`），另一种是`异步任务（asynchronous）`。同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入`"任务队列"（task queue）`的任务，`只有"任务队列"通知主线程`，某个异步任务可以执行了，该任务才会进入主线程执行。

```
 (1)所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。
（2）主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
（4）主线程不断重复上面的第三步。
```
![img](http://ou3alp906.bkt.clouddn.com/eventloop.png)

# 定时器

经典面试题
```js

console.log(1);
setTimeout(function(){console.log(2);},1000);
console.log(3);

1, 3, 2
```

如果将setTimeout()的第二个参数设为0，就表示当前代码执行完（执行栈清空）以后，立即执行（0毫秒间隔）指定的回调函数。

```js
setTimeout(function(){console.log(1);}, 0);
console.log(2);
```
`setTimeout(fn,0)`的含义是，指定某个任务在主线程`最早可得的空闲时间执行`，也就是说，`尽可能早得执行`。它在"任务队列"的尾部添加一个事件，因此要等到同步任务和"任务队列"现有的事件都处理完，才会得到执行。

HTML5标准规定了setTimeout()的第二个参数的最小值（最短间隔），`不得低于4毫秒`，如果低于这个值，就会自动增加。在此之前，老版本的浏览器都将最短间隔设为10毫秒。另外，对于那些DOM的变动（尤其是涉及页面重新渲染的部分），通常不会立即执行，而是每16毫秒执行一次。这时使用`requestAnimationFrame()`的效果要好于setTimeout()。
需要注意的是，`setTimeout()只是将事件插入了"任务队列"`，必须等到当前代码（执行栈）执行完，主线程才会去执行它指定的回调函数。要是当前代码耗时很长，有可能要等很久，所以并没有办法保证，回调函数一定会在setTimeout()指定的时间执行。

# 参考
+ [JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
+ [什么是 Event Loop？](http://www.ruanyifeng.com/blog/2013/10/event_loop.html)