const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
  // if-else 实现简易路由
  if (req.url === '/') {
    fs.readFile('./index.html', (err,data) => {
      res.writeHead(200, {
        'Content-type': 'text/html;charset=utf-8'
      })
      res.end(data)
    })
  } else if (req.url === '/test' && req.method === 'GET') {
    res.setHeader('Content-type', 'application/octet-stream')
    let timeId = setInterval(() => {
      res.write(Date.now() + '\n')
    }, 1000)
    setTimeout(() => clearInterval(timeId), 10000)
  }
}).listen(8080, () => {
  console.log('服务器启动在8080端口')
})