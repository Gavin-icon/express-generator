const express = require('./express');
const app = new express();

app.use('/useful',(req,res) => {
  res.end('App')
});

app.get('/', (req,res,next)=> {
  console.log(1)
  next()
}, (req,res,next) => {
  console.log(2)
  next()
})
app.get('/', (req,res) => {
  console.log(3)
  res.end('/')
})
app.get('/a?cd', (req,res) => {
  res.end('/a?cd')
});
app.get('/api/:id', (req,res) => {
  console.log(req.params)
  res.end('/about')
});
app.post('/', (req,res) => {
  res.end('post/')
});
app.post('/about', (req,res) => {
  res.end('/about')
});

app.listen(3000, () => {
  console.log('服务启动成功！')
});