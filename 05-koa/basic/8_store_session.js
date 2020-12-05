const Koa = require('koa');

const Router = require('koa-router');
const Session = require('koa-session');
const Render = require('koa-art-template');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = new Koa();

Render(app, {
  // 页面查找的目录
  root: path.join(__dirname, 'view'),
  // 设置后缀名
  extname: '.html',
  // debug: false 则每次压缩页面及js，包括混淆，静态数据不会实时更新（不每次都读文件)
  debug: process.env.NODE_ENV !== 'production'
});

let router = new Router();
router.get('/', async ctx => {
    ctx.render('login');
  })
  .post('/login', async ctx => {
    let params = ctx.request.body;

    let username = params.username;
    let password = params.password;

    // 回写cookie，保存用户数据到session中
    if (username != 'leo' || password != '233') {
      ctx.throw(400);
    } else {
      // 使用session保存数据
      ctx.session.user = {
        username: 'leo'
      }
      // ctx.body = '登录成功';
      ctx.redirect('/info');
    }
  })
 .get('/info', ctx => {
    ctx.body = `当前登录用户为:` + ctx.session.user.username
  });

// const CONFIG = {
//   key: 'koa:sess', // session的名
//   maxAge: 86400000,
//   overwrite: true,
//   // false的时候，客户端可以操作cookie
//   httpOnly: true, // 不允许在客户端操作cookie

// // {"user":{"username":"abac"},"_expire":1532529416883,"_maxAge":86400000}
// // 未作数据签名
//   signed: true, // 数字签名，保证数据不被串改
//   rolling: false,  // 过期时间访问顺延
//   renew: false, // 过期后是否创建新的
//   encode: function(str) {
//     let token = jwt.sign(str, 'shhhhh');
//     //console.log(token);
//     return token;
//   },
//   decode: function(str) {
//     let decoded = jwt.verify(str, 'shhhhh');
//     //console.log(data);
//     return decoded;
//   }
// };

// 通过任意字符串为基准进行加密算法的字符串
app.keys = ['2019-12-21 22:56:26'];

/**
 * 在上个版本中，客户端不仅存储了 key 同时也存储了 value，
 * 每次请求都携带 key-value，不安全！
 * 通过使用 store 对象，在服务器内存中保存 session，
 * 客户端只需存放 key，每次请求携带 key 即可取到对应的 sesson 值。
 */
let store = {
  storage: {},
  get(key) {
    console.log('store key:', key);
    return this.storage[key]
  },
  set(key, session) {
    console.log(key, session);
    this.storage[key] = session
  },
  destroy(key) {
    delete this.storage[key]
  }
}

// ctx.session
app.use(Session({
  store: store
}, app));

// ctx.request.body挂载属性
app.use(bodyParser());

// 处理错误页面
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    ctx.status = 200;
    ctx.body = `<div>页面出错了</div>`;
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// 错误处理
app.on('error', async (err, ctx) => {
  console.log(err);
});

app.listen(8080, () => {
  console.log('Listening on 8080')
});
