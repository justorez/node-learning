const fs = require('fs');

// 读取文件
fs.readFile('../assets/temp.txt', (error, data) => {
  if (error) {
    throw error;
  }
  console.log(data);
  console.log(data.toString('utf8')) // 默认 utf8
  console.log('==============================================')
});

let now = new Date();
let content = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n`;
// flag:a 等价于 fs.appendFile
fs.writeFile('../assets/a.txt', content, {flag:'a'}, err => {
  if (err) {
    throw err;
  }
  console.log('写入文件成功！')
});
