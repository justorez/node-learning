// 1.引入对象
const express = require('express');
const Koa = require('koa');

// 2.创建服务器对象
let server1 = express();
let server2 = new Koa();

// 3.处理响应
server1.use((req, res, next) => {
  // express中保持了原生node中的api
  // content-type: text/html
  res.send('express ok!');
})
server2.use((context) => {
  // content-type: text/plain
  context.body = 'koa ok!';
});

// 4.监听端口
server1.listen(8080, () => {
  console.log('服务器启动在8080端口');
});
server2.listen(8081, () => {
  console.log('服务器启动在8081端口');
});
