---
title: 了解XMLHttpRequest
date: 2017-10-11
categories: js
tags: http
toc: true
---
# 前言
最近与后端联调，后端问能不能发送get请求时，把请求参数放入请求体中，HTTP GET 请求在请求体中带参数的问题

# ajax介绍
AJAX不是JavaScript的规范，它只是一个哥们“发明”的缩写：Asynchronous JavaScript and XML，意思就是用JavaScript执行异步网络请求。

```javascript
function success(text) {
    var textarea = document.getElementById('test-response-text');
    textarea.value = text;
}

function fail(code) {
    var textarea = document.getElementById('test-response-text');
    textarea.value = 'Error code: ' + code;
}

var request = new XMLHttpRequest(); // 新建XMLHttpRequest对象

request.onreadystatechange = function () { // 状态发生变化时，函数被回调
    if (request.readyState === 4) { // 成功完成
        // 判断响应结果:
        if (request.status === 200) {
            // 成功，通过responseText拿到响应的文本:
            return success(request.responseText);
        } else {
            // 失败，根据响应码判断失败原因:
            return fail(request.status);
        }
    } else {
        // HTTP请求还在继续...
    }
}

// 发送请求:
request.open('GET', '/api/categories');
request.send();

alert('请求已发送，请等待响应...');
```
# XMLHttpRequest对象
## Attributes
| 参数               | 类型                                                     |  描述 |
|-------------------|-------------------------------------------------------- |--------|
|  onreadystatechange |  Function  | 一个JavaScript函数对象，当readyState属性改变时会调用它。回调函数会在user interface线程中调用 |
|  readyState       |  unsigned short  | 5种状态 |
| response | 	varies | 响应实体的类型由 responseType 来指定， 可以是 ArrayBuffer， Blob， Document， JavaScript 对象 (即 "json")， 或者是字符串。如果请求未完成或失败，则该值为 null。|
| responseType      |  DOMString  |  设置该值能够改变响应类型。就是告诉服务器你期望的响应格式。1."" (空字符串) 2."arraybuffer"（ArrayBuffer） 3."blob"（Blob）4."document"（Document）5."json"（JavaScript 对象，解析自服务器传递回来的JSON 字符串。） 6."text" （字符串）|
|  responseXML     |  responseXML	Document?  | 本次请求的响应是一个 Document 对象，如果是以下情况则值为 null：请求未成功，请求未发送，或响应无法被解析成 XML 或 HTML。当响应为text/xml 流时会被解析。当 responseType 设置为"document"，并且请求为异步的，则响应会被当做 text/html 流来解析。只读. 注意: 如果服务器不支持 text/xml Content-Type 头，你可以使用 overrideMimeType() 强制 XMLHttpRequest 将响应解析为 XML。 |
|  status	     |  unsigned short  | 该请求的响应状态码 (例如, 状态码200 表示一个成功的请求).只读. |
|  statusText       |  DOMString  | 可以在 upload 上添加一个事件监听来跟踪上传过程。 |
|  withCredentials       |  	boolean  | 表明在进行跨站(cross-site)的访问控制(Access-Control)请求时，是否使用认证信息(例如cookie或授权的header)。 默认为 false。注意: 这不会影响同站(same-site)请求.|



```javascript
  // 现代浏览器
  var request = new XMLHttpRequest(); // 新建XMLHttpRequest对象
```
## XHR用法
> 使用XHR对象时， 要调用的第一个方法是open(), 接受3个参数（"get", "post" ....），请求的地址url， 表示是否异步发送请求的布尔值。
```javascript
  xhr.open('get', '/advTest', false); // 并不会真正发送请求，而只是启动一个请求以备发送
```
[跨域相关](https://juejin.im/post/58e8c932ac502e4957bde78b)

要发送特定请求 需要调用send()方法：
```javascript
  xhr.open('get', '/advTest', false); // 并不会真正发送请求，而只是启动一个请求以备发送
  xhr.send(null);
```
*xhr.send(null)* send()方法必须接收一个参数，即要作为请求主体发送的数据，如果不需要发送则必须发送null,因为这个参数对浏览来说是必须的。调用send()之后请求被发送至服务器。
### 同步
当第三个为false时发送同步请求，*JavaScript*代码会等到服务器响应之后在继续执行。
当收到响应后，响应的数据会自动填充XHR对象的属性，相关属性如下
+ responseText: 作为响应主体被返回的文本
+ responseXML: 如果响应的内容是 "text/xml" 或 "application/xml",则这个属性中将保存包含着响应数据的XML DOM 文档。
+ status: 响应的HTTP状态
+ statusText: HTTP状态说明。
### 异步
同布发送请求当然没有问题，但多数情况下， 我们还是要发送异步请求，才能让js继续执行而不必等待响应。可通过检测readyState变化
```javascript
request.onreadystatechange = function () { // 状态发生变化时，函数被回调
    if (request.readyState === 4) { // 成功完成
        // 判断响应结果:
        if (request.status === 200) {
            // 成功，通过responseText拿到响应的文本:
            return success(request.responseText);
        } else {
            // 失败，根据响应码判断失败原因:
            return fail(request.status);
        }
    } else {
        // HTTP请求还在继续...
    }
}
```
*readyState*当前请求的活动阶段。
+ 0: 请求未开始。 未调用open();
+ 1: 启动。 调用open()方法，但未调用send()方法。
+ 2：发送。 调用send()方法，但尚未收到响应。
+ 3：接收。 收到部分响应数据。
+ 4：完成。 收到全部响应数据，可在客户端使用。

xhr.abort(); -> xhr停止触发XHR对象
## HTTP头部信息
每个http请求和响应都会带有相应的头部。

+ Accept: 浏览器能处理的内容类型
+ Cookie: 单前页面设置的任何Cookie
+ Host: 发出请求的页面所在的域
+ Referer： 请求页面发出的URL
+ User-Agent：浏览器用户代理字符串
等等。。。

自定义请求头 需在open()以后，send()之前发送。

```javascript
xhr.open('GET', '/api/categories');
// 自定义请求头部信息
xhr.setRequextHeader('myHeader', 'myValue');
xhr.send();
```
getResponseHeader('XX') 获取请求头中特定字段
getAllResponseHeader('XX') 获取请求头中所有字段

## GET请求

GET请求常用于向服务器查询信息。添加请求参数于url之后。 对于传入open()方法的URL末尾的查询字符的名称和值必须使用encodeURLComponent() 进行编码。

```javaScript
xhr.open('get', 'test.php?name=程心&age=24&other=AA', true); // 准备异步请求
// 添加参数工具方法
fucntion addURLParams(url, name, value) {
  url += (url.index('?') == -1 ? '?' : '&');
  url += encodeURLComponent(name) + '=' + encodeURLComponent(value);
  return url; 
}
```
## POST请求
POST常用于向服务器发送需要保存的请求。 *POST请求应该将数据作为请求体的主体提交，而GET传统上不是这样*
## GET POST区别
```javascript
// post
xhr.open('GET', '/api/categories');
// 自定义请求头部信息
xhr.setRequextHeader('Content-Type', 'application/x-www-form-urlencoded');
var from = document.getElementById('user-info');
xhr.send(serialize(from));
xhr.send();
```
POST 消耗的资源更多， GET最快达到POST的2倍。get url长度有限制
# XMLHttpRequest 2级
规范化的XMLHttpRequest
## FromData
序列化表单以及创建与表单格式相同的数据
```javascript
  var data = new FromData();
  data.append('name', '云天明');
```
## 超时设定
XHR对象 timeout属性，表示请求在等待响应多久之后停止
```javascript
xhr.timeout = 1000;
xhr.ontimeout = function() {
    console.log('超时了。。')
}
```
## overrideMimeType() 方法
overrideMimeType() 用于重写MIME类型。
# 总结
由于这个疑问，借此重新学习了下ajax。url在请求头的Referer中故get请求在请求体中。
# 参考
[HTTP请求行、请求头、请求体详解](http://blog.csdn.net/u010256388/article/details/68491509)
[XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)

