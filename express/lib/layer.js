const pathRegexp = require('path-to-regexp');
// 存储stack中每个处理信息
function Layer(path, handler) {
  this.path = path
  this.handler = handler
  this.params = {}
  this.keys = []
  this.regExp = pathRegexp(path, this.keys, {})
}
Layer.prototype.match = function(pathname) {
  const match = this.regExp.exec(pathname)
  console.log(match)
  if (match) {
    this.keys.forEach((key,index) => {
      this.params[key.name] = match(index)
    })
    return true
  }
  // 匹配use中间件
  // if (this.isUseMiddleware){
  //   // 传递的全是函数
  //   if (this.path === '/') {
  //     return true
  //   }
  //   // 传递的是路径
  //   if (pathname.startsWith(`${this.path}/`)){
  //     console.log(this.path)
  //     return true
  //   }
  // }
  return false

}

module.exports = Layer;