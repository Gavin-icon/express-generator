const methods = require("methods")
const Layer = require("./layer")
const url = require('url');

// @ 主要是用来实现多个中间件函数
function Route (){
  this.stack = []
}

Route.prototype.dispatch = function(req,res,out) {
  let index = 0;
  const method = req.method.toLowerCase();

  const next = () => {
    if (index >= this.stack.length){
      return out(); // 内层的stack执行完毕后，外层的layer被执行
    }

    const layer = this.stack[index++];
    if (layer.method === method) {
      // handler: (req,res,next) => {}
      return layer.handler(req,res,next)
    }
    next()
  }
  next()
}

methods.forEach(method => {
  Route.prototype[method] = function(path, handlers) {
    // route的method解析handlers,然后然后存储在当前的stack中
    handlers.forEach(handler => {
      const layer = new Layer(path, handler);
      layer.method = method;
      this.stack.push(layer);
    })
  }
})

module.exports = Route;