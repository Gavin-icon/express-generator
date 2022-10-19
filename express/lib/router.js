const methods = require("methods");
const url = require('url');
// const pathRegexp = require('path-to-regexp');
const Layer = require('./layer');
const Route = require('./route');

function Router() {
  this.stack = []
}
methods.forEach(method => {
  Router.prototype[method] = function(path, handlers){
    const route = new Route();
    // 外层Layer存储path, route的dispatch方法
    const layer = new Layer(path,route.dispatch.bind(route));
    layer.route = route
    this.stack.push(layer);
    // 将path和handlers传递给route的method中
    route[method](path, handlers);
  }
})
Router.prototype.handler = function(req,res) {
  // 获取传递进来的path
  const {pathname} = url.parse(req.url)
  // 定义索引0， 方便next函数执行
  let index = 0;
  // 封装next函数
  const next = () => {
    // 判断index是否超过当前stack的长度，即是否遍历完成
    if (index >= this.stack.length) {
      return res.end(`Can not get ${pathname}`);
    }
    const layer = this.stack[index++]; // layer中有match方法判断pathname并且将params动态路由存储
    // 调用layer的match方法去匹配客户端传递的path是否和服务端匹配
    const match = layer.match(pathname); // layer.match返回值为Boolean
    if (match) {
      // 将req.params的参数合并，动态路由合并
      req.params = req.params || {}
      Object.assign(req.params, layer.params)

      // next 为外层的next, 内层走完后，走到外层 ,这里的handler指的是route中的dispatch
      return layer.handler(req,res,next)
    }
    next()
  }
  next();
}
Router.prototype.use = function(path, handlers) {
  if (typeof path === 'function') {
    handlers.unshift(path)
    path = '/'
  }

  handlers.forEach(handler => {
    const layer = new Layer(path, handler)
    layer.isUseMiddleware = true
    console.log(layer)
    this.stack.push(layer)
  })
}
module.exports = Router