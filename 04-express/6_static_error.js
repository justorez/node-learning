const express = require('express');
const fs = require('fs');

let server = express();

server.engine('.html', require('express-art-template'));

server.set('view options', {
  debug: process.env.NODE_ENV !== 'production',
});

server.set('view engine', '.html');

let router = express.Router();

router
.get('/', (req, res, next) => {
  res.render('index');
})
.get('/error', (req, res, next) => {
  console.log('请求进来了？', req.url);
  // 假如获取文件
  let errorPath = './abc/e.txt';
  try {
    fs.readFileSync(errorPath);
    res.render('index');
  } catch (err) {
    // throw err;  // 不能直接返回给用户异常
    next(err); // 触发一个具备4个参数的中间件函数
  }
})
// all-所有的请求方式
.all('*', (req, res) => {
  res.send('404 警告！');
})

// 要把 public 下的文件暴露出来
server.use('/public', express.static('./public'));
// 当虚拟目录 /public 被匹配以后，未来 url 都会去除掉 /public

server.use(router);


// 处理错误(参数位置错误优先) -> 优雅的用户体验
server.use((err, req, res, next) => {
  // send-自动处理编码
  res.send('<h2>服务器君抽风了...<a href="/">去首页看看吧</a></h2>');
})

server.listen(8080, () => {
  console.log('localhost:8080');
});
