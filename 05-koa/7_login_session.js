const Koa = require('koa');

// 引入
const Router = require('koa-router');
const render = require('koa-art-template');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const path = require('path');


var app = new Koa();

render(app, {
  // 页面查找的目录
  root: path.join(__dirname, 'view'),
  // 设置后缀名
  extname: '.html',
  // debug: false 则每次压缩页面及js，包括混淆，静态数据不会实时更新（不每次都读文件)
  debug: process.env.NODE_ENV !== 'production'
});


let router = new Router();
router
.get('/', async ctx => {
  ctx.render('login');
})
.post('/login', async ctx => {
  let params = ctx.request.body;

  let username = params.username;
  let password = params.password;
  // 回写cookie，保存用户数据到session中
  if (username != 'leo' || password != '233') {
    // koa中的异常处理
    // ctx.set('content-type','text/html;charset=utf-8');
    ctx.throw(200, '用户或密码错误！');
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


// 通过任意字符串为基准进行加密算法的字符串
app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true, // 不允许在客户端操作cookie

  // {"user":{"username":"abac"},"_expire":1532529416883,"_maxAge":86400000}
  // 未作数据签名
  signed: true, // 数字签名，保证数据不被串改
  rolling: false,  // 过期时间访问顺延
  renew: false, // 过期后是否创建新的
};

app.use(session(CONFIG, app));

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods())

// 错误处理
app.on('error', async (err, ctx) => {
  console.log(err);
});

app.listen(8080);