const express = require('express');

let app = express();

// 1.获取路由中间件对象
let router = express.Router();

// 2.配置路由规则 router.method(URL,fn)
// fn 回调参数有 req,res,next
router
.get('/json', (req, res) => {
  // res.end 只能响应 string 或 文件 data buffer
  res.json([{name:'leo'}]);
})
.get('/redirect', (req, res) => {
  res.redirect('http://www.baidu.com');
})
.get('/download', (req, res) => {
  // 文件是如何被下载成功的
  // 基于服务器响应的 content-type 等头信息
  res.download('../assets/temp.txt');
})
.get('/jsonp', (req, res) => {
  res.jsonp('jack & rose');
})

// 3.将 router 加入到应用 app.use
app.use(router);

app.listen(8080, () => {
  console.log('http://localhost:8080');
});
