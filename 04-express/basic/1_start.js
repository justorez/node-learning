const express = require('express');

// 构建一个服务器对象
// 原生的方式：http.createServer()
let server = express();

// 开启服务器监听端口
server.listen(8080);

// 处理响应
server.use((req,res) => {
  res.end('hello express'); // 原生API
})