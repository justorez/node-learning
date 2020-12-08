const mount = require('koa-mount');
const koa = require('koa');
const static = require('koa-static');
const fs = require('fs');

const app = new koa;

app.use(
  mount('/static', static(`${__dirname}/static/`))
);

app.use(
  mount('/download', require('./download'))
);

app.use(
  mount('/detail', require('./detail'))
);

app.use(
  mount('/play', require('./play'))
);

app.use(
  mount('/', async (ctx) => {
    ctx.body = fs.readFileSync(`${__dirname}/index.html`, 'utf-8')
  })
);

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
});
