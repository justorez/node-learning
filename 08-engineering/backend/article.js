const http = require('http')

// 假数据
const articleData = require('./mockdata/article')

http.createServer((req, res) => {

  res.writeHead(200, { 'content-type': 'application/json' })
  res.end(JSON.stringify(articleData))

}).listen(4003, () => console.log('article http server listening: 4003'))
