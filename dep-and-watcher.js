// 本例子简单实现依赖收集与追踪原理

class Dep {
  /* 用来存放Watcher对象的数组 */
  constructor() {
    this.subs = [];
  }
  /* 在subs中添加一个Watcher对象 */
  addSub() {
    this.subs.push(Dep.target);
  }
  /* 通知所有的Watcher对象更新视图*/
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    })
  }
}

class Watcher {
  /* 在new一个watcher对象时将该对象赋值给Dep.target,在get中收集到相应的Dep*/
  constructor() {
    Dep.target = this;
  }
  /* 模拟更新视图的方法 */
  update() {
    console.log("视图更新了！")
  }
}

/**
 * 通过defineProperty定义某个对象属性的get set，实现响应式
 * @param  obj 目标对象
 * @param  key 需要操作的对象属性
 * @return 无返回
 */
function defineReactive(obj, key) {
  let val = obj[key]
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    enumerable: true, /* 属性可枚举 */
    configurable: true, /* 属性可被修改或删除 */
    get: function reactiveGetter() {
      /* 依赖收集，将当前Watcher对象加入到dep的subs中 */
      dep.addSub(Dep.target)
      console.log("get")
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
       val = newVal;
      /* 通知所有的Watcher对象更新视图 */
      console.log("set")
      dep.notify();
    }
  })
}

/**
 * 实现可观察的，遍历value对象进行defineReactive操作
 * @param  value 需要操作的对象（暂不考虑数组）
 * @return 无返回
 */
function observer(value) {
  if (!value || (typeof value !== 'object')) return;
  for(let key in value) {
    defineReactive(value, key);
  }
}

/**
 * 实现一个响应式的Vue类，data当作一个对象简单处理，实际上在组件中是一个函数
 */
class Vue {
  /* Vue构造类 对data实现响应式 */
  constructor(options) {
    this._data = options.data;
    observer(this._data);
    /* 新建一个Watcher对象，让Dep.target指向它 */
    new Watcher();
    console.log('模拟render～', this._data.test)
  }
}

let globalObj = {
    test: 'test'
};

let vue1 = new Vue({
  data: globalObj
})

Dep.target = null;

globalObj.test = "hello"


