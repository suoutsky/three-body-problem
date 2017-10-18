---
title: Vue组件之Tooltip
date: 2017-10-17
categories: Vue
tags: Vue
toc: true
---

# 前言
本文主要Alert 组件的大致框架， 提供少量可配置选项。 旨在大致提供思路

# tooltip
常用于展示鼠标 hover 时的提示信息。

## 模板结构

```html
<template>
  <div style="position:relative;">
    <span ref="trigger">
      <slot>
      </slot>
    </span>
    <div class="d-tooltip"
      v-bind:class="{
        'top':     placement === 'top',
        'left':    placement === 'left',
        'right':   placement === 'right',
        'bottom':  placement === 'bottom',
        'disable': type === 'disable',
        'delete':  type === 'delete',
        'visible': show === true  
      }"
      ref="popover"
      role="tooltip">
      <div class="d-tooltip-arrow"></div>
      <div class="d-tooltip-inner">
        <slot name="content" v-html="content"></slot>
      </div>
    </div>
  </div>
</template>
```
大致结构DOM结构 一个div 包含 箭头 及 气泡内容。

v-bind中可选tooltip位置，是否禁用，及显示隐藏

slot 差值供自定义 默认接收content内容

## script
```js
import EventListener from '../utils/EventListener.js';

export default {
  props: {
    // 需要监听的事件
    trigger: {
      type: String,
      default: 'click'
    },
    effect: {
      type: String,
      default: 'fadein'
    },
    title: {
      type: String
    },
    // toolTip消息提示
    content: {
      type: String
    },
    header: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String
    }
  },
  data() {
    return {
      // 通过计算所得 气泡位置  
      position: {
        top: 0,
        left: 0
      },
      show: true
    };
  },
  watch: {
    show: function(val) {
      if (val) {
        const popover = this.$refs.popover;
        const triger = this.$refs.trigger.children[0];
        // 通过placement计算出位子
        switch (this.placement) {
          case 'top' :
            this.position.left = triger.offsetLeft - popover.offsetWidth / 2 + triger.offsetWidth / 2;
            this.position.top = triger.offsetTop - popover.offsetHeight;
            break;
          case 'left':
            this.position.left = triger.offsetLeft - popover.offsetWidth;
            this.position.top = triger.offsetTop + triger.offsetHeight / 2 - popover.offsetHeight / 2;
            break;
          case 'right':
            this.position.left = triger.offsetLeft + triger.offsetWidth;
            this.position.top = triger.offsetTop + triger.offsetHeight / 2 - popover.offsetHeight / 2;
            break;
          case 'bottom':
            this.position.left = triger.offsetLeft - popover.offsetWidth / 2 + triger.offsetWidth / 2;
            this.position.top = triger.offsetTop + triger.offsetHeight;
            break;
          default:
            console.log('Wrong placement prop');
        }
        popover.style.top = this.position.top + 'px';
        popover.style.left = this.position.left + 'px';
      }
    }
  },
  methods: {
    toggle() {
      this.show = !this.show;
    }
  },
  mounted() {
    if (!this.$refs.popover) return console.error("Couldn't find popover ref in your component that uses popoverMixin.");
    // 获取监听对象
    const triger = this.$refs.trigger.children[0];
    // 根据trigger监听特定事件
    if (this.trigger === 'hover') {
      this._mouseenterEvent = EventListener.listen(triger, 'mouseenter', () => {
        this.show = true;
      });
      this._mouseleaveEvent = EventListener.listen(triger, 'mouseleave', () => {
        this.show = false;
      });
    } else if (this.trigger === 'focus') {
      this._focusEvent = EventListener.listen(triger, 'focus', () => {
        this.show = true;
      });
      this._blurEvent = EventListener.listen(triger, 'blur', () => {
        this.show = false;
      });
    } else {
      this._clickEvent = EventListener.listen(triger, 'click', this.toggle);
    }
    this.show = !this.show;
  },
  // 在组件销毁前移除监听，释放内存
  beforeDestroy() {
    if (this._blurEvent) {
      this._blurEvent.remove();
      this._focusEvent.remove();
    }
    if (this._mouseenterEvent) {
      this._mouseenterEvent.remove();
      this._mouseleaveEvent.remove();
    }
    if (this._clickEvent) this._clickEvent.remove();
  }
};

```

```js
// EventListener.js
const EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  }
};

export default EventListener;
```
封装的事件监听

# 使用
 使用`content`属性来决定`hover`时的提示信息。由`placement`属性决定展示效果：`placement`属性值为：`方向-对齐位置`；四个方向：`top`、`left`、`right`、`bottom`。`trigger`属性用于设置触发`tooltip`的方式，默认为`hover`。
```html
<d-tooltip content="我是tooltip">
  <d-button type="text">鼠标移动到我上面试试</d-button>
</d-tooltip>
<d-tooltip content="我是tooltip" trigger="click">
  <d-button type="text">点我试试</d-button>
</d-tooltip>
```
## content内容分发

设置一个名为`content`的`slot`。
```html
<d-tooltip>
  <d-button type="text">鼠标移动到我上面试试</d-button>
  <p slot="content" class="tooltip-content">我是内容分发的conent。</p>
</d-tooltip>
```

# Attributes
| 参数               | 说明                                                     | 类型              | 可选值      | 默认值 |
|--------------------|----------------------------------------------------------|-------------------|-------------|--------|
|  content        |  显示的内容，也可以通过 `slot#content` 传入 DOM  | String            | — | — |
|  placement        |  Tooltip 的出现位置  | String           |  top/right/bottom/left |  top |
| trigger | tooltip触发方式 | String | — | hover |
