const http = require('http')
const fs = require('fs')

let server = http.createServer()

server.on('request', (req, res) => {
  // req 是只读对象
  // res 是只写对象
  // console.log(req.headers) // 请求头
  // console.log(req.url) // 请求行
  // console.log(req.method) // 请求行
  // req.on('data', (data) => {
  //   console.log(data.toString()) // 请求体
  // })
  
  // 写头 => 1.一次性写 2.多次写
  res.setHeader('name', 'leo')
  res.setHeader('Content-Type','text/plain;charset=utf-8')
  // 一次性写一定在多次写的后面
  // res.writeHead(200, {'d','d'})
  
  // 写行
  res.writeHead(200)
  
  // 写体
  let content = fs.readFileSync('../assets/temp.txt','utf8')
  res.write(content);
  
  res.end('\nxxx')
})

let port = 8080
server.listen(port, () => {
  console.log(`服务器启动在${port}端口`)
})
