---
title: 了解redux
date: 2017-10-05
categories: react, redux
tags: react
toc: true
---

# 什么是react

> React 是一个用于构建用户界面的 JAVASCRIPT 库。
React主要用于构建UI，很多人认为 React 是 MVC 中的 `V`（视图）。

# 为什么需要redux

react 只涉及 view 层, React 只是 DOM 的一个抽象层，并不是 Web 应用的完整解决方案。有两个方面，它没涉及。

+ 代码结构
+ 组件之间通信

而 redux 正好能解决这两件事

# redux工作流
![img](http://ou3alp906.bkt.clouddn.com/reduce.jpeg)

## 1.Store

Store 就是保存数据的地方。

```js
import { createStore } from 'redux';
const store = createStore(fn);

const state = store.getState();
```
`createStore(reduces, globalState)`
createStore函数接受另一个函数作为参数，返回新生成的 Store 对象

## 2.Action

State 的变化，会导致 View 的变化。用户无法直接改变State, 只能触发上绑定的事件。Action 就是 View 发出，表示 State 应该要发生变化了。

```js
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
};
```

## 3.Action Creator

```js
const ADD_TODO = '添加 TODO';

function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}

const action = addTodo('Learn Redux');
```
定义一个函数来生成 Action，这个函数就叫 Action Creator。

## 4.store.dispatch()

store.dispatch()是 View 发出 Action 的唯一方法。表示 State 应该要发生变化了。

```js
import { createStore } from 'redux';
const store = createStore(fn);

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
```

## 5.Reducer

Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。

## 6.store.subscribe()

Store 允许使用store.subscribe方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

```js
import { createStore } from 'redux';
const store = createStore(reducer);
store.subscribe(listener);
```

# 一个极简的 redux 例子

simplest-redux-examp(https://github.com/jackielii/simplest-redux-example)

```js
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

// React 组件
class Counter extends Component {
  render() {
    const { value, onIncreaseClick } = this.props
    return (
      <div>
        <span>{value}</span>
        <button onClick={onIncreaseClick}>Increase</button>
      </div>
    )
  }
}
// 属性验证
Counter.propTypes = {
  value: PropTypes.number.isRequired,
  onIncreaseClick: PropTypes.func.isRequired
}

// Action
const increaseAction = { type: 'increase' }

// Reducer 一个(state, action) => new state
function counter(state = { count: 0 }, action) {
  const count = state.count
  switch (action.type) {
    case 'increase':
      return { count: count + 1 }
    default:
      return state
  }
}

// Store 
const store = createStore(counter)

// Map Redux state to component props
// 传入组件的属性
function mapStateToProps(state) {
  return {
    value: state.count
  }
}

// Map Redux actions to component props
// 组件需要使用props传入的来  dispatch
function mapDispatchToProps(dispatch) {
  return {
    onIncreaseClick: () => dispatch(increaseAction)
  }
}

// Connected Component
const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

```

# 参考

[Redux 入门教程-阮一峰](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)
