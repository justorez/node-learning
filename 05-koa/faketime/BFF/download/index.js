const koa = require('koa');
const fs = require('fs');
const mount = require('koa-mount');

const app = new koa();

const htmlBuf = fs.readFileSync(__dirname + '/resource/index.html');
app.use(
  mount('/', (ctx) => {
    ctx.status = 200;
    ctx.type = 'html';
    ctx.body = htmlBuf;
  })
);

module.exports = app;
