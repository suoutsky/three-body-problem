---
title: this
date: 2017-10-05
categories: js
tags: this
toc: true
---
# this指针
this指向被调用的context
```javascript
function foo(num) {
    console.log( "foo: " + num );
// 记录foo被调用的次数
// 注意，在当前的调用方式下(参见下方代码)，this确实指向foo
    this.count++;
}
foo.count = 0; 

var i;
for (i=0; i<10; i++) { if (i > 5) {
// 使用call(..)可以确保this指向函数对象foo本身
    foo.call( foo, i ); }
}
// foo: 6 // foo: 7 // foo: 8 // foo: 9
// foo被调用了多少次?
console.log( foo.count ); // 4

```
> foo.call(foo, i)

foo的调用环境是window(此时this指向window)

call(foo, this) 将foo的作用域显式的绑定到 foo上

```javascript
//永远得不到想要结果
function foo() { var a = 2;
  this.bar(); 
}
function bar() { 
  console.log( this.a );
}
   
foo(); 
```
> 需要明确的是，this 在任何情况下==都不指向==函数的词法作用域。在JavaScript内部，作用域确实和对象类似，可见的标识符都 是它的属性。但是作用域“对象”无法通过JavaScript代码访问，它存在于JavaScript引擎 内部。

# this 到底是什么

> 我们说过this 是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决==于函数调用==时的各种条件。

this 的绑定 和函数声明的位置没有任何关系，只取决于函数的调用方式。

当一个函数被调用时，会创建一个活动记录(有时候也称为执行上下文  ==AO==)。这个记录会包含函数在哪里被调用(调用栈)、函 数的调用方法 、传入的参数等信息。this 就是记录的其中一个属性，会在函数执行的过程中用到。

## 调用栈
>分析调用栈 (就是为了到达当前执行位置所调用的所有函数)

```javascript
function baz() {
// 当前调用栈是:baz
// 因此，当前调用位置是全局作用域
    console.log( "baz" );
    bar(); // <-- bar的调用位置
}

function bar() {
// 当前调用栈是baz -> bar // 因此，当前调用位置在baz中
  console.log( "bar" );
  foo(); // <-- foo的调用位置

}

function foo() {
// 当前调用栈是baz -> bar -> foo // 因此，当前调用位置在bar中
   console.log( "foo" );
}
baz(); // <-- baz的调用位置
    
```