---
title: Vue组件之Alert
date: 2017-10-16
categories: Vue
tags: Vue
toc: true
---
# 前言
本文主要Alert 组件的大致框架， 提供少量可配置选项。 旨在大致提供思路
# Alert
![Alert](http://ou3alp906.bkt.clouddn.com/alert.png)

用于页面中展示重要的提示信息。
## templat模板结构

```html
<template>
  <div v-show="visible" class="Alert">
    <i v-show="closable" class="iconhandle close" @click="close">&#xe609;</i>
    <slot></slot>
  </div>
</template>
```
大致结构 alert框，icon图标， slot插值 （其他样式颜色选项...）
如果需要动画 可以在外层包上Vue内置组件transition
```html
<transition name="alert-fade">
</transition>
```

## script

```js
export default {
  name: 'Alert',

  props: {
    closable: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: true,
      twoWay: true
    },
    type: {
      type: String,
      default: 'info'
    }
  },
  data() {
    return {
      visible: this.show
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$emit('update:show', false);
      this.$emit('close');
    }
  }
};
```
+ name: 组件的名字
+ props: 属性
+ methods: 方法 
点击关闭 向外暴露2个事件
# 使用

```js
import Alert from './Alert.vue'

Alert.install = function(Vue){
    Vue.component('Alert', Alert);
}
export default Alert
```

```html
<Alert :closable="false">
  这是一个不能关闭的alert
</Alert>
<Alert>
  这是一个可以关闭的alert
</Alert>
```

# Attribute

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| closable | 是否可关闭 | boolean | — | true |
| show | 是否显示 | boolean | — | true |

# Event

| 事件名称      | 说明          |  回调参数  |
|---------- |-------------- |-------|
| update:show | 关闭时触发，是否显示false | false |
| close | 关闭时触发 | —  |

