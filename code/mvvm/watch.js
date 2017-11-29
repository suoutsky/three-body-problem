/**
 * 作为一个和Observer和Compile都有关系的“蓝银”，他做的事情有以下几点
 *a、通过Dep接收数据变动的通知，实例化的时候将自己添加到dep中
 *b、属性变更时，接收dep的notify，调用自身update方法，触发Compile中绑定的更新函数，进而更新视图
 */
/**
 * @class 观察类
 * @param {[type]}   vm      [vm对象]
 * @param {[type]}   expOrFn [属性表达式]
 * @param {Function} cb      [回调函数(一半用来做view动态更新)]
 */
function Watcher(vm, expOrFn, cb) {
    this.vm = vm;
    expOrFn = expOrFn.trim();
    this.expOrFn = expOrFn;
    this.cb = cb;
    this.depIds = {};
  
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    }
    else {
      this.getter = this.parseGetter(expOrFn);
    }
    this.value = this.get();
  }
  Watcher.prototype = {
    update: function () {
      this.run();
    },
    run: function () {
      let newVal = this.get();
      let oldVal = this.value;
      if (newVal === oldVal) {
        return;
      }
      this.value = newVal;
      // 将newVal, oldVal挂载到MVVM实例上
      this.cb.call(this.vm, newVal, oldVal);
    },
    get: function () {
      Dep.target = this;  // 将当前订阅者指向自己
      let value = this.getter.call(this.vm, this.vm); // 触发getter，将自身添加到dep中
      Dep.target = null;  // 添加完成 重置
      return value;
    },
    // 添加Watcher to Dep.subs[]
    addDep: function (dep) {
      if (!this.depIds.hasOwnProperty(dep.id)) {
        dep.addSub(this);
        this.depIds[dep.id] = dep;
      }
    },
    parseGetter: function (exp) {
      if (/[^\w.$]/.test(exp)) return;
  
      let exps = exp.split('.');
  
      // 简易的循环依赖处理
      return function(obj) {
          for (let i = 0, len = exps.length; i < len; i++) {
              if (!obj) return;
              obj = obj[exps[i]];
          }
          return obj;
      }
    }
  }