const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

var app = new Koa();

app.use(bodyParser());

app.use(async ctx => {
  console.log(ctx.query);
  console.log(JSON.stringify(ctx.query));
  
  // 获取原始的 body（未解析的）
  console.log(ctx.request.rawBody);
  
  // 解析后的 body 会存储在 ctx.request.body
  // 如果解析内容为空，body 会设置为一个空对象 {}
  ctx.body = ctx.request.body;

  // 客户端：name=jack
  // 解析后：{ "name": "jack" }

  // 客户端发的是以下字符串，同时头 application/json
  // { "name": "json" }
});

app.listen(8080);
