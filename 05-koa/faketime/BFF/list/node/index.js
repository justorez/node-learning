const app = new (require('koa'));
const mount = require('koa-mount');
const fetch = require('./fetch')
const ReactDOMServer = require('react-dom/server');
require('@babel/register')({
  presets: ['@babel/preset-react']
});
const App = require('./template/app.jsx');
const template = require('../../utils/template')(__dirname + '/template/index.html')

app.use(mount('/data', async (ctx) => {
  ctx.body = await fetch(Number(ctx.query.sort || 0), Number(ctx.query.filt || 0));
}));

app.use(async (ctx) => {
  ctx.status = 200;
  const filtType = Number(ctx.query.filt || 0);
  const sortType = Number(ctx.query.sort || 0);
  const reactData = await fetch(sortType, filtType);

  const reactString = ReactDOMServer.renderToString( App(reactData) );
  // console.log(reactString);
  ctx.body = template({
    reactString,
    reactData,
    filtType,
    sortType
  })
})

// app.listen(3000)

module.exports = app;
