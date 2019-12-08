const express = require('express');

let app = express();

app.listen(8080, () => {
  console.log('服务器启动在8080');
});

app.use('/vegetable', (req, res, next) => {
  next(); // 放行
});
app.use('/vegetable', (req, res, next) => {
  res.end('萝卜');
  next();
});
app.use('/meat', (req, res, next) => {
  console.log('牛肉');
  next();
});
app.use('/meat', (req, res, next) => {
  console.log('羊肉');
  next();
});