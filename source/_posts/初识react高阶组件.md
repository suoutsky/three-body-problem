---
title: 初识react高阶组件
date: 2017-11-20
categories: js
tags: react
toc: true
---
# 前言

最近一直再做数据可视化，业务的理解，数据的理解确实如数据可视化要求的一样，有了更多的理解。但是技术上还停留在echart，Hchart, 画图上。正好一个机会，看了[流形大大的知乎live](https://www.zhihu.com/lives/876828176767148032)。对大数据有了更深的了解。也明确了大数据时代，前端所应该具备的职业素养

# 高阶组件

> 高阶组件HOC（Higher Order Component，高阶组件）就是一个 React 组件包裹着另外一个 React 组件

# React 中两种 HOC 的实现方法

 React 中两种 HOC 的实现方法：Props Proxy (PP) and Inheritance Inversion (II)

 ## Props Proxy (PP)

 ```js
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    render() {
      return <WrappedComponent {...this.props}/>
    }
  }
}
 ```

 ## Inheritance Inversion (II)

 ```js
 function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      return super.render()
    }
  }
}
 ```
> 返回的 HOC 类（Enhancer）继承了 WrappedComponent。之所以被称为 Inheritance Inversion 是因为 WrappedComponent 被 Enhancer 继承了，而不是 WrappedComponent 继承了 Enhancer。在这种方式中，它们的关系看上去被反转（inverse）了。

> Inheritance Inversion 允许 HOC 通过 this 访问到 WrappedComponent，意味着它可以访问到 state、props、组件生命周期方法和 render 方法

### 一致化处理（Reconciliation process)

一致化处理(Reconciliation)包括的就是React元素的比较以及对应的React元素不同时对DOM的更新，即可理解为React 内部将虚拟 DOM 同步更新到真实 DOM 的过程，包括新旧虚拟 DOM 的比较及计算最小 DOM 操作。

`这很重要，意味着 Inheritance Inversion 的高阶组件不一定会解析完整子树`

### Inheritance Inversion 作用

+ 渲染劫持（Render Highjacking）
+ 操作 state

#### 渲染劫持（Render Highjacking）

+ 在由 render输出的任何 React 元素中读取、添加、编辑、删除 props

```js
export function IIHOCDEBUGGER(WrappedComponent) {
  return class II extends WrappedComponent {
    render() {
      return (
        <div>
          <h2>HOC Debugger Component</h2>
          <p>Props</p> <pre>{JSON.stringify(this.props, null, 2)}</pre>
          <p>State</p><pre>{JSON.stringify(this.state, null, 2)}</pre>
          {super.render()}
        </div>
      )
    }
  }
}
```

+ 读取和修改由 render 输出的 React 元素树

```js
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      const elementsTree = super.render()
      let newProps = {};
      if (elementsTree && elementsTree.type === 'input') {
        newProps = {value: 'may the force be with you'}
      }
      const props = Object.assign({}, elementsTree.props, newProps)
      const newElementsTree = React.cloneElement(elementsTree, props, elementsTree.props.children)
      return newElementsTree
    }
  }
}
```

+ 有条件地渲染元素树

```js
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      if (this.props.loggedIn) {
        return super.render()
      } else {
        return null
      }
    }
  }
}
```

+ 把样式包裹进元素树（就像在 Props Proxy 中的那样）

# 高阶组件例子

```js
// app.js
import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import Auth from './auth';

// 发帖组件
class Btn extends Component {

    send() {
        alert('发帖子');
    }

    render() {
        return (
            <button onClick={this.send}>{this.props.name}</button>
        )
    }
}

// 喜欢组件
class BtnLike extends Component {

    send() {
        alert('喜欢');
    }

    render() {
        return (
            <button onClick={this.send}>{this.props.name}</button>
        )
    }
}

class App extends Component {
    render() {
        // 高阶组件Auth()
        let AuthBtn = Auth(Btn),
            AuthBtnLike = Auth(BtnLike);

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started1, edit <code>src/App.js</code> and save to reload.
                </p>
                <p><AuthBtn name={'发帖'}/></p>
                <p><AuthBtnLike name={'喜欢'}/></p>
            </div>
        );
    }
}

export default App;
```

```js
// 高阶组件 Auth.js
/**
 * Created by Rayr Lee on 2017/11/19.
 */

import React from 'react';

var isLogin = false;
// 控制能否登录 
window.isLogin = isLogin;
// Props Proxy (PP) 的最简实现：
// function ppHOC(WrappedComponent) {  
//     return class PP extends React.Component {    
//       render() {      
//         return <WrappedComponent {...this.props}/>    
//       }  
//     } 
//   }
export default function (ComposedComponent) {
    return class extends React.Component {

        tips() {
            alert('请登录');
        }

        render() {

            return (
                isLogin ?
                    <ComposedComponent {...this.props}></ComposedComponent> :
                    <button onClick={this.tips}>{this.props.name}</button>
            )
        }
    }
}
```
# 参考
+ [深入理解 React 高阶组件](https://zhuanlan.zhihu.com/p/24776678)

+ [为什么React和Immutable是好朋友](https://juejin.im/post/59171f7aa0bb9f005fe59685
)