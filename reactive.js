//本例子只实现响应式的一部分，即遍历对象中的属性实现通过defineProperty定义该属性的一些属性和get set方法

/*
 * cb函数模拟视图更新动作
 */
function cb(val) {
  console.log("视图更新了！", val)
}

/**
 * 通过defineProperty定义某个对象属性的get set，实现响应式
 * @param  obj 目标对象
 * @param  key 需要操作的对象属性
 * @return 无返回
 */
function defineReactive(obj, key) {
  let val = obj[key]
  Object.defineProperty(obj, key, {
    enumerable: true, /* 属性可枚举 */
    configurable: true, /* 属性可被修改或删除 */
    get: function reactiveGetter() {
      return val;
    },
    set: function reactiveSetter(newVal) {
      if (newVal === val) return;
      // obj[key] = newVal;
      cb(newVal);
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
    defineReactive(value, key)
  }
}

/**
 * 实现一个响应式的Vue类，data当作一个对象简单处理，实际上在组件中是一个函数
 */
class Vue {
  /* Vue构造类 对data实现响应式 */
  constructor(options) {
    this._data = options.data
    observer(this._data)
  }
}

let o = new Vue({
    data: {
        test: "test."
    }
});
o._data.test = "hello world!";  /* 视图更新啦～ */


