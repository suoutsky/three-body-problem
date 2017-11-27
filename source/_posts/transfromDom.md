---
title: 自定义指令-移动dom
date: 2017-11-20
categories: js
tags: react
toc: true
---
# 为什么需要移动dom

层级问题`modal`被遮挡`fixed`样式混乱问题

# 指令

## 钩子函数

指令定义函数提供了几个钩子函数（可选）：

+ bind: 只调用一次，指令第一次绑定到元素时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。

+ inserted: 被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 document 中）。

+ update: 被绑定元素所在的模板更新时调用，而不论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新（详细的钩子函数参数见下）。

+ componentUpdated: 被绑定元素所在模板完成一次更新周期时调用。

+ unbind: 只调用一次， 指令与元素解绑时调用。

## 钩子函数参数

钩子函数被赋予了以下参数：

+ el: 指令所绑定的元素，可以用来直接操作 DOM 。
+ binding: 一个对象，包含以下属性：
+ name: 指令名，不包括 v- 前缀。
+ value: 指令的绑定值， 例如： `v-my-directive="1 + 1"`, value 的值是 `2`。
+ oldValue: 指令绑定的前一个值，仅在 update 和 + componentUpdated 钩子中可用。无论值是否改变都可用。
expression: 绑定值的字符串形式。 例如 `v-my-directive="1 + 1"` ， expression 的值是 "1 + 1"。
+ arg: 传给指令的参数。例如 `v-my-directive:foo， arg 的值是 "foo"`。

+ modifiers: 一个包含修饰符的对象。 例如： `v-my-directive.foo.bar, 修饰符对象 modifiers 的值是 { foo: true, bar: true }`。
+ vnode: Vue 编译生成的虚拟节点。

+ oldVnode: 上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。

> 除了 `el` 之外，其它参数都应该是`只读`的，尽量不要修改他们。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行。


# 一个移动dom指令

## 1.要移动哪个dom节点

```js
function getTarget (node) {
    // 如果node没有传入 默认移动到body下
    if (node === void 0) {
        node = document.body
    }
    if (node === true) { return document.body }
    return node instanceof window.Node ? node : document.querySelector(node)
}
```

## 2.生命周期

```js
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
    }
```

```js
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
    }
```

```js
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
```    

## 整体结构

```js
const directive = {
    inserted(){},
    componentUpdated(){},
    unbind(){}
}
export default directive {}
```

```html
// 使用
<div v-transfer-dom :data-transfer="transfer">
</div>
```

```js
    import TransferDom from '../../directives/transfer-dom';
// 局部注册
directives: { TransferDom },

```

```html
/**
 *
 * Get target DOM Node
 * @param {any} node
 * @returns {Node}
 */
function getNode(node) {
  // if (node === void 0) {
  //   node = document.body;
  // }
  console.log(node);
  // setTimeout(() => {
  console.log(document.querySelector('.top-rank-type-wrap'));
  return node instanceof window.Node ? node : document.querySelector('.top-rank-type-wrap');
  // }, 1);
};

// const homes = new Map();

export default {
  install(Vue, options) {
    Vue.directive('transfromDom', {
      bind: function() {
        let self = this;
        Vue.nextTick(function() {
          let value = self.value;
          console.log(`'name - '       + ${self.name} + '<br>' +
          'expression - ' +  ${self.expression} + '<br>' +
          'argument - '   +  ${self.arg} + '<br>' +
          'modifiers - '  +  ${JSON.stringify(self.modifiers)} + '<br>' +
          'value - '      +  ${value}`);
          const { parentNode } = self.el;
          const home = document.createComment('');
          // let hasMovedOut = false;
          parentNode.replaceChild(home, self.el);
          getNode(value).parentNode.insertBefore(self.el, getNode(value));
          // hasMovedOut = true;a
          // if (!homes.has(self.el)) homes.set(self.el, { parentNode, home, hasMovedOut });
        });
      },
      update: function() {
        // let value = this.expression;
        // const { parentNode, home, hasMovedOut } = homes.get(this.el);
        // if (!hasMovedOut && value) {
        //   // 移除原来位子
        //   parentNode.replaceChild(home, this.el);
        //   // 添加到目标位置
        //   getNode(value).appendChild(this.el);
        //   homes.set(this.el, Object.assign({}, homes.get(this.el), { hasMovedOut: true }));
        // } else if (hasMovedOut && value === false) {
        //   // 移动过，移回原地
        //   parentNode.replaceChild(this.el, home);
        //   homes.set(this.el, Object.assign({}, homes.get(this.el), { hasMovedOut: false }));
        // } else if (value) {
        //   // 移动过一次移到别的地方
        //   getNode(value).appendChild(this.el);
        // }
      },
      unbind: function() {
        // homes.delete(this.el);
      }
    });
  }
};

```