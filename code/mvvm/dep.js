/**
 * @class 依赖类 Dep
 * 
 */
let uid = 0;
function Dep() {
  // dep id
  this.id = uid++;
  // array 存储watcher
  this.subs = [];
}
Dep.target = null;
Dep.prototype = {
  /**
   * [添加订阅者]
   * @param {[Watcher]} sub [订阅者]
   */ 
  addSub: function(sub) {
    this.subs.push(sub);  
  },
  /**
   * [移除订阅者]
   * @param  {[Watcher]} sub [订阅者]
   */
  removeSub: function(sub) {
    let index = this.subs.indexOf(sub);
    if (index !== -1) {
      this.subs.splice(index, 1);  
    }
  },
  /*
   * [通知数据变更]
   */
  notify: function () {
    this.subs.forEach(sub => {
      // 执行sub的update更新函数
      sub.update();
    });
  },
  /**
   *  addwatch
   */
  depend: function() {
    Dep.target.addDep(this);
  }
}
