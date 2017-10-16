---
title: Vue之插件编写
date: 2017-10-05
categories: vue
tags: Vue
toc: true
---
# 前言
[前段时间看到黄轶老师的一篇文章感触颇多。特别是下面这一段话](https://juejin.im/post/59300b2e2f301e006bcdd91c)
> 插件 Vue 化引发的一些思考
这篇文章我不仅仅是要教会大家封装一个 scroll 组件，还想传递一些把第三方插件（原生 JS 实现）Vue 化的思考过程。很多学习 Vue.js 的同学可能还停留在 “XX 效果如何用 Vue.js 实现” 的程度，其实把插件 Vue 化有两点很关键，一个是对插件本身的实现原理很了解，另一个是对 Vue.js 的特性很了解。对插件本身的实现原理了解需要的是一个思考和钻研的过程，这个过程可能困难，但是收获也是巨大的；而对 Vue.js 的特性的了解，是需要大家对 Vue.js 多多使用，学会从平时的项目中积累和总结，也要善于查阅 Vue.js 的官方文档，关注一些 Vue.js 的升级等。
所以，我们拒绝伸手党，但也不是鼓励大家什么时候都要去造轮子，当我们在使用一些现成插件的同时，也希望大家能多多思考，去探索一下现象背后的本质，把 “XX 效果如何用 Vue.js 实现” 这句话从问号变成句号。

# 插件分类
![插件分类](http://ou3alp906.bkt.clouddn.com/vue%E6%8F%92%E4%BB%B6.png)

插件通常会为 Vue 添加全局功能，插件的编写方法一般分为4类，如上图所示

> Vue.js 的插件应当有一个公开方法 install 。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象

```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }
  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })
  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })
  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```
# 插件编写方法

## 1. 添加全局方法或属性

```js
export default {
    install(Vue, option) {
        Vue.$myName = '罗辑',
        Vue.$myJob = '面壁者',
        Vue.$do = () => {
            // 全局方法
        }
    }
}
```
在install方法中，我们直接在Vue实例上声明了$myName属性并进行了赋值，当该插件注册后只要存在Vue实例的地方你都可以获取到Vue.$myName的值，因为其直接绑定在了Vue实例上。

## 2. 添加全局资源

```js
export default {
    install(Vue, options) {
        Vue.directive('dom', {
            bind: function() {},

            // 当绑定元素插入到 DOM 中。
            inserted: function(el, binding, vnode, oldVnode) {

                // 移动元素
                el.tranfromDom();
            },

            update: function() {},
            componentUpdated: function() {},
            unbind: function() {}
        });
    },
}

```
添加全局资源包含了添加全局的指令／过滤器／过渡等，上方代码我们通过Vue.directive()添加了一个全局指令v-dom，其主要包含了5种方法，其中inserted代表当绑定元素插入到 DOM 中执行，而el.tranfromDom()代表要移动的元素，这样如果我们在一个Modal弹窗上绑定该指令就会自动的移动dom（实现实际dom位子与模板中dom位子相分离）。

```js
// Thanks to: https://github.com/airyland/vux/blob/v2/src/directives/transfer-dom/index.js
// Thanks to: https://github.com/calebroseland/vue-dom-portal

/**
 * Get target DOM Node
 * @param {(Node|string|Boolean)} [node=document.body] DOM Node, CSS selector, or Boolean
 * @return {Node} The target that the el will be appended to
 */
function getTarget (node) {
    if (node === void 0) {
        node = document.body
    }
    if (node === true) { return document.body }
    return node instanceof window.Node ? node : document.querySelector(node)
}

const directive = {
    inserted (el, { value }, vnode) {
        if (el.dataset.transfer !== 'true') return false;
        el.className = el.className ? el.className + ' v-transfer-dom' : 'v-transfer-dom';
        const parentNode = el.parentNode;
        if (!parentNode) return;
        const home = document.createComment('');
        let hasMovedOut = false;

        if (value !== false) {
            parentNode.replaceChild(home, el); // moving out, el is no longer in the document
            getTarget(value).appendChild(el); // moving into new place
            hasMovedOut = true
        }
        if (!el.__transferDomData) {
            el.__transferDomData = {
                parentNode: parentNode,
                home: home,
                target: getTarget(value),
                hasMovedOut: hasMovedOut
            }
        }
    },
    componentUpdated (el, { value }) {
        if (el.dataset.transfer !== 'true') return false;
        // need to make sure children are done updating (vs. `update`)
        const ref$1 = el.__transferDomData;
        if (!ref$1) return;
        // homes.get(el)
        const parentNode = ref$1.parentNode;
        const home = ref$1.home;
        const hasMovedOut = ref$1.hasMovedOut; // recall where home is

        if (!hasMovedOut && value) {
            // remove from document and leave placeholder
            parentNode.replaceChild(home, el);
            // append to target
            getTarget(value).appendChild(el);
            el.__transferDomData = Object.assign({}, el.__transferDomData, { hasMovedOut: true, target: getTarget(value) });
        } else if (hasMovedOut && value === false) {
            // previously moved, coming back home
            parentNode.replaceChild(el, home);
            el.__transferDomData = Object.assign({}, el.__transferDomData, { hasMovedOut: false, target: getTarget(value) });
        } else if (value) {
            // already moved, going somewhere else
            getTarget(value).appendChild(el);
        }
    },
    unbind (el) {
        if (el.dataset.transfer !== 'true') return false;
        el.className = el.className.replace('v-transfer-dom', '');
        const ref$1 = el.__transferDomData;
        if (!ref$1) return;
        if (el.__transferDomData.hasMovedOut === true) {
            el.__transferDomData.parentNode && el.__transferDomData.parentNode.appendChild(el)
        }
        el.__transferDomData = null
    }
};

export default directive;
```
ivew 中的v-transfer-dom指令


## 3. 注入组件 添加全局Mixin

```js
export default {
    install(Vue, options) {
        Vue.mixin({
            methods: {
                say() {
                    console.log('hello..');
                }
            }
        });
    },
}
```
mixin代表混合的意思，我们可以全局注册一个Mixin，其会影响注册之后创建的每个 Vue 实例，上方代码注册后会在每个组件实例中添加say方法，在单文件组件中可以直接通过this.say()调用。当然如果实例中存在同名方法，则mixin方法中创建的会被覆盖，同时mixin对象中的钩子将在组件自身钩子之前调用。

```js
/**
 * Show migrating guide in browser console.
 *
 * Usage:
 * import Migrating from 'element-ui/src/mixins/migrating';
 *
 * mixins: [Migrating]
 *
 * add getMigratingConfig method for your component.
 *  getMigratingConfig() {
 *    return {
 *      props: {
 *        'allow-no-selection': 'allow-no-selection is removed.',
 *        'selection-mode': 'selection-mode is removed.'
 *      },
 *      events: {
 *        selectionchange: 'selectionchange is renamed to selection-change.'
 *      }
 *    };
 *  },
 */
export default {
  mounted() {
    if (process.env.NODE_ENV === 'production') return;
    if (!this.$vnode) return;
    const { props, events } = this.getMigratingConfig();
    const { data, componentOptions } = this.$vnode;
    const definedProps = data.attrs || {};
    const definedEvents = componentOptions.listeners || {};

    for (let propName in definedProps) {
      if (definedProps.hasOwnProperty(propName) && props[propName]) {
        console.warn(`[Element Migrating][Attribute]: ${props[propName]}`);
      }
    }

    for (let eventName in definedEvents) {
      if (definedEvents.hasOwnProperty(eventName) && events[eventName]) {
        console.warn(`[Element Migrating][Event]: ${events[eventName]}`);
      }
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {},
        events: {}
      };
    }
  }
};
```
element 的迁移引导mixin

```js
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
export default {
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }
  }
};
```
element 为Vue2.x添加简化版的 dispatch，broadcast（改方法vue1中有原生实现）当然这里还为做成单独插件
## 4. 添加实例方法
```js
export default {
  install(Vue, option) {
    Vue.prototype.$myName = '罗辑';
    Vue.prototype.showMyName = value => {
      console.log(value);
    };
  }
}
```
添加实例方法是最常用的一种方法，其直接绑定在vue的原型链上（一直是js的传统）。实例方法可以在组件内部，通过this.$myMethod来调用。

# 使用插件
过全局方法 Vue.use() 使用插件：
```js
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
```
或者传入一个选项对象：
```js
Vue.use(MyPlugin, { someOption: true })
```
Vue.use 会自动阻止注册相同插件多次，届时只会注册一次该插件。

Vue.js 官方提供的一些插件 (例如 vue-router) 在检测到 Vue 是可访问的全局变量时会自动调用 Vue.use()。然而在例如 CommonJS 的模块环境中，你应该始终显式地调用 Vue.use():

```js
// 用 Browserify 或 webpack 提供的 CommonJS 模块环境时
var Vue = require('vue')
var VueRouter = require('vue-router')
// 不要忘了调用此方法
Vue.use(VueRouter)
```