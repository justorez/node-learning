const http = require('http');

let port = 8080;
http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain;charset=utf-8',
  });
  res.end(port+'端口服务器被访问了');
}).listen(port, () => {
  console.log('服务器启动在' + port);
})