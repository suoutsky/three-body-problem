/**
 * 
 * 实现数据劫持
 * @param {any} data 
 */
function observe(value, asRootData) {
  if (!value || typeof value !== 'object') {
    return;
  }
 return new Observer(vaule);
}

function Observer(value) {
  this.value = value;
  this.walk(value);
}
Observer.prototype = {
  walk: function(obj) {
    let self = this;
    Object.keys(obj).forEach(key => {
      self.observeProperty(obj, key, obj[key]);
    });
  },
  observeProperty: function(obj, key, val) {
    let dep = new Dep();
    let childOb = observe(val);
    Object.defineProperty(obj,  key,   {
      enumerable: true, //可枚举
      configurable: true, //可重新定义
      get: function() {
        if (Dep.target) {
          dep.depend();  
        }
        if (childOb) {
          childOb.dep.depend();  
        }
        return val;
      },
      set: function(newVal) {
        if (val === newVal || (newVal !== newVal && val !== val)){
          return;
        }
        val = newVal;
        //监听子属性
        childOb = observe(newVal);
        // 通知数据变更
        dep.notify();
      }
    });  
  }
}  


