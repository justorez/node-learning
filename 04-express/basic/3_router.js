const express = require('express');

let app = express();

// 1.获取路由中间件对象
let router = express.Router();

// 2.配置路由规则 router.method(URL,fn)
// fn 回调参数有 req,res,next
router
.get('/login', (req, res) => {
  res.end('login page');
})
.get('/register', (req, res) => {
  res.end('register page');
})

// 3.将 router 加入到应用 app.use
app.use(router);

app.listen(8080, () => {
  console.log('localhost:8080');
});