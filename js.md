```js
/**
 * 是否为对象
 * @param {*} obj 任意数据
 * @returns {boolean}
 */
const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'
```

```js
/**
 * 倒计时
 * @param {number} during 倒计时总时间，单位：s
 * @param {function} duringCallback 计时期间的回调函数
 * @param {function} endCallback 计时结束的回调函数
 * @param {string} timer 定时器的名字，用于清除定时器
 */
function countDown (during, duringCallback, endCallback, timer) {
  during = +during;
  if (during > 0) {
    duringCallback(during);
    during--;
    window[timer] = setTimeout(() => {
      countDown(during, duringCallback, endCallback, timer);
    }, 1000)
  } else {
    clearTimeout(window[timer]);
    endCallback();
  }
}
```

```js
/**
 * 防抖
 * @param {function} fn 执行函数
 * @param {number} wait 等待时间，毫秒
 * @param {boolean} immediate 是否立即执行
 */
function debounce (fn, wait = 0, immediate = false) {
  let timer = null
  let _immediate = immediate
  return function () {
    if (_immediate) {
      fn.apply(this, arguments)
      _immediate = false
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      immediate ? (_immediate = true) : fn.apply(this, arguments)
    }, wait)
  }
}
```
