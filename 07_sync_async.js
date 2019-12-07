const fs = require('fs');

console.log('同步读取前...');
// 阻塞
fs.readFileSync('./assets/雪中悍刀行.epub');
console.log('同步读取以后执行的工作...');

console.log('异步读取前...');
fs.readFile('./assets/雪中悍刀行.epub', (err,data) => {
  if (err) throw err;
  console.log('异步读取成功！');
});
console.log('异步读取以后执行的工作...');