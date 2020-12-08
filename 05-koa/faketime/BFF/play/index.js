const fs = require('fs');
const app = new (require('koa'));
const mount = require('koa-mount');
const graphqlHTTP = require('koa-graphql');

app.use(
  // 给 koa-graphql 传一个 graphql 的协议文件，就会自动帮你生成 graphql-api
  mount('/api', graphqlHTTP({
    schema: require('./schema')
  }))
)

app.use(
  mount('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = fs.readFileSync(`${__dirname}/resource/index.html`, 'utf-8')
  })
)

module.exports = app;
