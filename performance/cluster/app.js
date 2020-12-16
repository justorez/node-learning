const path = require('path');
const fs = require('fs');
const http = require('http');

http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.writeHead(200);

    // 这里不对代码进行优化，用于比对使用 cluster 的提升效果
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    // res.write();
    res.end(html);
})
.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
})
