const mount = require('koa-mount');
const koa = require('koa');
const static = require('koa-static');

const app = new koa;

app.use(
  mount('/static', static(`${__dirname}/static/`))
);
app.use(
  mount('/download', require('./download/index'))
);
app.use(
  mount('/detail', require('./detail/index'))
);

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000')
});
