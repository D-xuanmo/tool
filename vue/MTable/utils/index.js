export const numberToArray = num => {
  let arr = []
  for (let i = 1; i < num; i++) {
    arr.push(i)
  }
  return arr
}

export const isFunction = fn => Object.prototype.toString.call(fn) === '[object Function]'

// 千位分
export const thousandDigit = num => num ? (num + '').replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,') : num
