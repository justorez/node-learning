/**
 * 读取一个html文件，展示给用户显示
 */
const fs = require('fs');
const Koa = require('koa');

let app = new Koa();

function asyncReadFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('./view/index.html', (err, data) => {
      if (err) {
        reject(err);
      }
      // 成功
      resolve(data);
    });
  });
}

app.use(async (ctx) => {
  ctx.set('content-type', 'text/html;charset=utf-8');
  
  if (ctx.url === '/') {
    try {
      let data = await asyncReadFile(); // 异常使用catch
      
      console.log(data);
      console.log(data.toString());
      
      // 二进制数据 buffer
      // 如果不设置响应头，自动设置流类型，会变成下载
      ctx.body = data;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e.message;
    }
    
  } else {
    ctx.body = 'ok';
  }
});

app.listen(8080);
