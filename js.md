```js
/**
 * 倒计时
 * @param {[number]} during [倒计时总时间，单位：s]
 * @param {[function]} duringCallback [计时期间的回调函数]
 * @param {[function]} endCallback [计时结束的回调函数]
 * @param {[string]} timer [定时器的名字，用于清除定时器]
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
