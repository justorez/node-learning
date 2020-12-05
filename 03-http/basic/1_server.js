const http = require('http')

let server = http.createServer()

server.on('request', (req, res) => {
  res.end('xxx')
})

let port = 3000
server.listen(port, () => {
  console.log(`服务器启动在${port}端口`)
})
