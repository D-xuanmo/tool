/**
 * [imageCompress 图片压缩]
 * @param  {[Array]} imgSrc       [传入图片地址]
 * @param  {Number} [width=1024]  [图片需要压缩的宽度,单位：px]
 * @param  {Number} [quality=1]   [图片需要压缩的质量，0~1之间]
 * @return {[type]}               [返回base64 jpeg格式图片]
 */
export function imageCompress (imgSrc, width = 1024, quality = 1) {
  let imgList = []
  imgSrc.map(v => {
    let img = new Promise((resolve, reject) => {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let oImg = new window.Image()
      oImg.src = v
      oImg.onload = function () {
        let height = width / (this.naturalWidth / this.naturalHeight)
        // 如果压缩的宽度大于图片自身的宽度，采取图片自身的宽度
        if (this.naturalWidth <= width) {
          width = this.naturalWidth
          height = this.naturalHeight
        }
        canvas.width = width
        canvas.height = height
        ctx.drawImage(this, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
    })
    imgList.push(img)
  })
  return Promise.all(imgList).then(res => Promise.resolve(res))
}
