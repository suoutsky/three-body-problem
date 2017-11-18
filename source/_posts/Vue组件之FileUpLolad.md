---
title: Vue组件之FileUpload
date: 2017-10-17
categories: Vue
tags: Vue
toc: true
---

# 关键api
## FileReader

> `FileReader` 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 `File` 或 `Blob` 对象指定要读取的文件或数据。

其中File对象可以是来自用户在一个`<input>`元素上选择文件后返回的`FileList`对象,也可以来自拖放操作生成的 `DataTransfer`对象,还可以是来自在一个`HTMLCanvasElement`上执行`mozGetAsFile()`方法后返回结果.
### FileReader()构造函数
`FileReader()`
返回一个新构造的FileReader。

```js
let reader = new FileReader();
```
| 方法              |   描述 |
|-------------------|--------|
|`abort（）`|中止该读取操作.在返回时,`readyState`属性的值为`DONE`.|
|`readAsArrayBuffer()`|开始读取指定的`Blob`对象或`File`对象中的内容. 当读取操作完成时,`readyState`属性的值会成为`DONE`,如果设置了`onloadend`事件处理程序,则调用之.同时,`result`属性中将包含一个`ArrayBuffer`对象以表示所读取文件的内容.|
|`readAsBinaryString()`|开始读取指定的`Blob`对象或`File`对象中的内容. 当读取操作完成时,`readyState`属性的值会成为DONE,如果设置了`onloadend`事件处理程序,则调用之.同时,`result`属性中将包含所读取文件的原始二进制数据.|
|`readAsDataURL()`|开始读取指定的`Blob`对象或`File`对象中的内容. 当读取操作完成时,`readyState`属性的值会成为`DONE`,如果设置了`onloadend`事件处理程序,则调用之.同时,`result`属性中将包含一个`data: URL`格式的字符串以表示所读取文件的内容.|
|`readAsText()`|开始读取指定的`Blob`对象或`File`对象中的内容. 当读取操作完成时,`readyState`属性的值会成为DONE,如果设置了`onloadend`事件处理程序,则调用之.同时,`result`属性中将包含一个字符串以表示所读取的文件内容|

事件处理程序(钩子)
|事件|描述|
|--|--|
|onabort|当读取操作被中止时调用.|
|onerror|当读取操作发生错误时调用.|
|onload|当读取操作成功完成时调用.|
|onloadend|当读取操作完成时调用,不管是成功还是失败.该处理程序在onload或者onerror之后调用.|
|onloadstart|当读取操作将要开始之前调用.|
|onprogress|在读取数据过程中周期性调用.|

## FormData
> XMLHttpRequest Level 2添加了一个新的接口`FormData`.利用`FormData`对象,我们可以通过JavaScript用一些键值对来模拟一系列表单控件,我们还可以使用`XMLHttpRequest`的`send()`方法来异步的提交这个"表单".比起普通的ajax,使用`FormData`的最大优点就是我们可以异步上传一个二进制文件.

### FormData()构造函数
```js
new FormData (form? : HTMLFormElement)
```
### 常用FormData的方法

`append(name, value, filename)` 给当前`FormData`对象添加一个键/值对.
+ name 字段名称.
+ value 字段值.可以是,或者一个字符串,如果全都不是,则该值会被自动转换成字符串.
+ filename (可选) 指定文件的文件名,当value参数被指定为一个Blob对象或者一个File对象时,该文件名会被发送到服务器上,对于Blob对象来说,这个值默认为"blob".

## Image
上传文件中最常见的就是图片文件了
### Image() 构造函数

> `Image()`函数将会创建一个新的`HTMLImageElement`实例。

它的功能等价于 `document.createElement('img')`

```js
Image(width, height)
```
```js
var myImage = new Image(100, 200);
myImage.src = 'picture.jpg';
document.body.appendChild(myImage);
```
相当于创建了：
```html
<img width="100" height="200" src="picture.jpg">
```


