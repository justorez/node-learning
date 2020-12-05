const koa = require('koa');
const fs = require('fs');
const mount = require('koa-mount');

const app = new koa();

app.use(
  mount('/', async (ctx) => {
    ctx.body = fs.readFileSync(__dirname + '/resource/index.html', 'utf-8')
  })
);

module.exports = app;
