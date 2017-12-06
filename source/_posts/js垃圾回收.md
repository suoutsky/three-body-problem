---
title: js垃圾回收
date: 2017-12-04
categories: js
tags: js
toc: true
---

# 老IE为什么卡？
ie以前垃圾清理的临界值 256变量， 4096对象或数组， 数组元素（slot） 64k字符串。 之后改为动态分配。

JavaScript 具有自动垃圾收集机制。

## 标记清除

JavaScript中最常用的垃圾收集方式标记清除。
垃圾收集器在运行时给内存中的所有变量，然后去掉环境中变量，及被环境中变量所引用的变量的标记。而在此之后再被打上标记的变量(被视为可删除变量)。最后垃圾收集器完成内存清除工作。销毁那些带标记的值并回收他们的内存空间。

## 引用计数

如果有零个引用指向它，则对象被认为是“可回收的垃圾”。
看看下面的代码：

```javascript
var o1 = {
  o2: {
    x: 1
  }
};
// 2 objects are created. 
// 'o2' is referenced by 'o1' object as one of its properties.
// None can be garbage-collected
var o3 = o1; // the 'o3' variable is the second thing that 
            // has a reference to the object pointed by 'o1'. 
                                                       
o1 = 1;      // now, the object that was originally in 'o1' has a         
            // single reference, embodied by the 'o3' variable
var o4 = o3.o2; // reference to 'o2' property of the object.
                // This object has now 2 references: one as
                // a property. 
                // The other as the 'o4' variable
o3 = '374'; // The object that was originally in 'o1' has now zero
            // references to it. 
            // It can be garbage-collected.
            // However, what was its 'o2' property is still
            // referenced by the 'o4' variable, so it cannot be
            // freed.
o4 = null; // what was the 'o2' property of the object originally in
           // 'o1' has zero references to it. 
           // It can be garbage collected.
```
### 循环引用造成问题
在循环中有一个限制。 在以下示例中，将创建两个对象并引用彼此，从而创建一个循环。在函数调用之后，它们将超出范围，因此它们实际上是无用的，可以被释放。然而，引用计数算法认为，由于两个对象中的每一个至少被引用一次，所以也不能被垃圾回收。

```js
function f() {
  var o1 = {};
  var o2 = {};
  o1.p = o2; // o1 references o2
  o2.p = o1; // o2 references o1. This creates a cycle.
}
f();
```


## 什么是内存泄漏？

内存泄漏可以被定义为应用程序不再需要的内存，由于某种原因，不会返回到操作系统或可用内存池。

四种常见的 JavaScript 内存泄漏

### 1:全局变量
JavaScript 以有趣的方式处理未声明的变量：对未声明变量的引用在全局对象内创建一个新变量。 在浏览器的情况下，全局对象是窗口对象（window）。

```javascript
   function foo(arg) {
     bar = 'global'
   }
   // 相当于
   function foo(arg) {
     window.bar = "global";
   }
``` 
果bar被认为仅仅在foo函数的范围内持有对变量的引用，并且您忘记使用var来声明它，则会创建一个额外的全局变量。

`为了防止这些错误的发生，添加'use strict'; `

### 2: 被遗忘的计时器或回调

在 JavaScript 中使用 `setInterval `是很常见的。大多数提供观察者和其他模式的回调函数库都会在自己的实例变得无法访问之后对其收到的任何引用进行处理。然而，在`setInterval`的情况下，这样的代码很常见：

```js
var serverData = loadData();
setInterval(function() {
    var renderer = document.getElementById('renderer');
    if(renderer) {
        renderer.innerHTML = JSON.stringify(serverData);
    }
}, 5000); //This will be executed every ~5 seconds.
```
由于setInterval仍然有效，因此无法回收（需要停止间隔才能发生）。如果无法回收 setInterval，则不能回收其依赖。这意味着无法回收 serverData（可能存储大量数据）。


在观察者的情况下，重要的是进行显式调用，以便在不再需要时删除它们（或者相关对象即将无法访问）。

`如今，大多数浏览器一旦观察到的对象变得无法访问，就能回收观察者处理程序，即使侦听器没有被明确删除。但是，在处理对象之前，明确删除这些观察者仍然是一个很好的做法。`
```javascript
var element = document.getElementById('launch-button');
var counter = 0;
function onClick(event) {
   counter++;
   element.innerHtml = 'text ' + counter;
}
element.addEventListener('click', onClick);
// Do stuff
element.removeEventListener('click', onClick);
element.parentNode.removeChild(element);
// Now when element goes out of scope,
// both element and onClick will be collected even in old browsers // that don't handle cycles well.
```

### 3: 闭包

JavaScript 语言开发的一个关键方面是闭包：一个可以访问外部（封闭）函数变量的内部函数。 由于 JavaScript 运行时的实现细节，可以通过以下方式泄漏内存：

```javascript
var theThing = null;
var replaceThing = function () {
  var originalThing = theThing;
  var unused = function () {
    if (originalThing) // a reference to 'originalThing'
      console.log("hi");
  };
  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log("message");
    }
  };
};
setInterval(replaceThing, 1000);
```
这个代码片段做了一件事：每次调用replaceThing时，TheThing都会获得一个新对象，它包含一个大的数组和一个新的闭包（someMethod）。同时，unused 变量保留一个引用了originalThing的闭包（来自前一次调用replaceThing的Thing）。

已经有点混乱了吗？重要的是，一旦为同一个父范围内的闭包创建了一个范围，该范围将被共享。

在这种情况下，为闭包someMethod创建的范围与unused共享。unused 对originalThing 引用。即使unused未被使用，一些方法也可以通过replaceThing范围之外的theThing（例如全局某处）使用。并且由于someMethod与unused 共享闭包范围，unused 的引用必须强制originalThing保持活动（两个闭包之间的整个共享范围）。这样可以防止其回收。

当这个代码段重复运行时，可以观察到内存使用量的稳定增长。当 GC 运行时，这不会变小。实质上，创建了一个关闭的链接列表（其根源以theThing变量的形式），并且这些闭包的范围中的每一个都对大阵列进行间接引用，导致相当大的泄漏。

`这个问题由Meteor团队发现，他们有一篇伟大的文章，详细描述了这个问题。`

### 4: 超出DOM引用

有时将 DOM 节点存储在数据结构中可能是有用的。 假设要快速更新表中的几行内容。 `存储对字典或数组中每个 DOM 行的引用可能是有意义的。` 当发生这种情况时，会保留对同一 DOM 元素的`两个`引用：一个在 `DOM 树中`，另一个`在字典中`。 如果将来某个时候您决定删除这些行，则需要使两个引用不可达。

```javascript
var elements = {
    button: document.getElementById('button'),
    image: document.getElementById('image')
};
function doStuff() {
    elements.image.src = 'http://example.com/image_name.png';
}
function removeImage() {
    // The image is a direct child of the body element.
    document.body.removeChild(document.getElementById('image'));
    // At this point, we still have a reference to #button in the
    //global elements object. In other words, the button element is
    //still in memory and cannot be collected by the GC.
}
```
还有一个额外的考虑，当涉及对 DOM 树内部或叶节点的引用时，必须考虑这一点。假设您在 JavaScript 代码中保留对表格特定单元格（标记）的引用。有一天，您决定从 DOM 中删除该表，但保留对该单元格的引用。直观地，可以假设 GC 将回收除了该单元格之外的所有内容。实际上，这不会发生：该单元格是该表的子节点，并且孩子们保持对父母的引用。也就是说，从 JavaScript 代码引用表格单元会导致整个表保留在内存中。保持对 DOM 元素的引用时仔细考虑。

# 参考
[【译】JS 中的内存管理 && 常见的 4 种内存泄露处理方式]
(https://elevenbeans.github.io/2017/10/13/js-memory-management/)