---
title: Vue源码之生命周期
date: 2017-11-28
categories: vue
tags: Vue
toc: true
---

# 前言
Vue.js 的目标是通过尽可能简单的 API 实现`响应的数据绑定`和`组合的视图组件`。
# 生命周期
![img](http://doc.vue-js.com/images/lifecycle.png)

vue实例对象始于new Vue()
1. beforeCreate
2. created
3. beforeMount
4. mounted
5. beforeUpdate
6. updated
7. beforeDestroy
8. destroyed


```js
var myVm=new Vue({
        el:"#app",
        data:{
            data:"hello",
            info:"world!"
        },
        beforeCreate:function(){
            console.log("创建前========")
            console.log(this.data)
            console.log(this.$el)
        },
        created:function(){
            console.log("已创建========")
            console.log(this.info)
            console.log(this.$el)
        },
        beforeMount:function(){
            console.log("mount之前========")
            console.log(this.info)
            console.log(this.$el)
        },
        mounted:function(){
            console.log("mounted========")
            console.log(this.info)
            console.log(this.$el)
        },
        beforeUpdate:function(){
            console.log("更新前========");

        },
        updated:function(){
            console.log("更新完成========");
        },
        beforeDestroy:function(){
            console.log("销毁前========")
            console.log(this.info)
            console.log(this.$el)
        },
        destroyed:function(){
            console.log("已销毁========")
            console.log(this.info)
            console.log(this.$el)
        }
    })
    ```