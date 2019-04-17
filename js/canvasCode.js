/**
 * [canvasCode 生成简易验证码]
 * @param  {[type]} el                     [canvas dom节点对象]
 * @param  {String} [type='operation']     [目前验证码支持数字的加减乘、和随机数字字母组合两种方式]
 * @param  {Number} [width=200]            [宽度,默认200px]
 * @param  {Number} [height=60]            [高度,默认60px]
 * @param  {String} [fontSize='32px']      [字体默认大小32px]
 * @param  {String} [fontFamily='Microsoft Yahei']       [字体名字]
 * @param  {String} [color='#333']         [文字颜色]
 * @return {String} [每次生成的验证码结果]
 */
export default function canvasCode(el, {
  type = 'operation',
  width = 200,
  height = 60,
  fontSize = '32px',
  fontFamily = 'Microsoft Yahei',
  color = '#333'
} = {}) {
  if (!el) throw new Error(`el ${el}`)
  let result = 0
  let canvas = el
  let ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height

  // 设置css样式
  canvas.style.width = `${width / 2}px`
  canvas.style.height = `${height / 2}px`
  ctx.clearRect(0, 0, width, height)

  // 文本对齐方式
  ctx.textAlign = 'center'

  // 如果颜色需要为渐变色的时候传入函数
  if (typeof color === 'function') ctx.fillStyle = color(canvas, ctx)

  // 类型为加减乘
  if (type === 'operation') {
    let nRandom1 = Math.floor(Math.random() * 10 + 5)
    let nRandom2 = Math.floor(Math.random() * 5)
    let aSymbol = ['+', '-', '*'][Math.floor(Math.random() * 3)]
    ctx.font = `${fontSize} ${fontFamily}`
    ctx.fillText(`${nRandom1} ${aSymbol} ${nRandom2} = ?`, width / 2, height / 2 + parseFloat(fontSize) / 2.5)

    // 运算并返回每次结果
    switch (aSymbol) {
      case '+':
        result = nRandom1 + nRandom2
        break
      case '-':
        result = nRandom1 - nRandom2
        break
      case '*':
        result = nRandom1 * nRandom2
        break
    }
    return result

  // 类型为字母和数字组合
  } else if (type === 'group') {
    let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let str = ''
    for (let i = 0; i < 4; i++) {
      let current = arr[Math.floor(Math.random() * 35)].toUpperCase()
      str += current
      ctx.font = `${parseFloat(fontSize) - 10 + Math.floor(Math.random() * 12)}px ${fontFamily}`
      ctx.fillText(current, (i + 1) * 25 , height / 2 + parseFloat(fontSize) / 2.5)
    }
    return result = str
  }
}
