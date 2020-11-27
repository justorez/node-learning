const fs = require('fs');
const path = require('path');
const game = require('./game');
const koa = require('koa');
const mount = require('koa-mount');

const app = new koa();

app.use(
  mount('/favicon.ico', ctx => {
    ctx.status = 200;
  })
);

// 利用 koa 中间件进行逻辑拆分
const gameKoa = new koa();
gameKoa.use(
  async (ctx, next) => {
    const playerAction = ctx.query.action;
    if (!playerAction) {
      ctx.status = 404;
      ctx.body = '想骗我六十九岁的老同志？';
      return;
    }

    ctx.playerAction = playerAction;
    next();
  }
);
gameKoa.use(
 async (ctx) => {
    try {
      const gameResult = game(ctx.playerAction);
      ctx.status = 200;
      if (gameResult === 0) {
        ctx.body = `<span class="normal">平局</span>`

      } else if (gameResult === -1) {
        ctx.body = `<span class="fail">你输了</span>`

      } else {
        ctx.body = `<span class="success">你赢了</span>`
      }
    } catch (error) {
      ctx.status = 500;
      ctx.body = '年轻人你不讲武德，我劝你耗子尾汁！'
    }
  }
);

app.use(
  mount('/game', gameKoa)
);

app.use(
  mount('/', ctx => {
    ctx.body = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
  })
);

app.listen(3000, () => {
  console.log('http://localhost:3000');
});
