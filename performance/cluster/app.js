const path = require('path');
const fs = require('fs');
const http = require('http');

const oom = [];
http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    res.writeHead(200);

    // 这里不对代码进行优化，用于直观感受 cluster 的性能提升
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    // oom.push(html); // 模拟内存泄露
    res.end(html);
})
.listen(3000, () => {
  console.log('Listening on http://localhost:3000');

  // while(true) {} // 模拟进程卡死
})
