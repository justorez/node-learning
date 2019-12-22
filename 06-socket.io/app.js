/**
 * 只有页面刷新，或者客户端发送请求询问服务器，
 * 才能拿到最新的消息，无法做到实时聊天的效果
 */
const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const render = require('koa-art-template');
const path = require('path');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');

const msgs = [
  { username:'小明',content:'哈哈哈'},
  { username:'小红',content:'呵呵呵'},
  { username:'小刚',content:'嘻嘻嘻'},
];

let app = new Koa();

// 配置视图模板
render(app, {
  root: path.join(__dirname, 'view'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});

let router = new Router();
router
.get('/', ctx => {
  ctx.render('index');
})
.post('/login', ctx => {
  let {username,password} = ctx.request.body;
  console.log(username, password);
  ctx.session.user = { username };
  // 重定向到聊天室
  ctx.redirect('/list');
})
.get('/list', ctx => {
  ctx.render('list', {
    username:ctx.session.user.username,
    msgs
  });
})
.post('/add', ctx => {
  let username = ctx.session.user.username;
  let content = ctx.request.body.msg;
  // 返回最新的消息集合
  msgs.push({username, content});
  ctx.body = msgs;
});


// 签名的依据
app.keys = ['2019-12-22 20:44:18'];
// 在服务器内存中存储 {session_id:用户数据}
let store = {
  storage:{},
  get(key) {
    return this.storage[key];
  },
  set(key,session) {
    this.storage[key] = session;
  },
  destroy(key) {
    delete this.storage[key];
  }
};

// 配置静态资源
app.use(static(path.resolve('./public')));
// 处理session，注意放在路由配置之前
app.use(session({store},app,));
// 处理请求体数据
app.use(bodyParser());
// 配置路由
app.use(router.routes());
// 处理405 501
app.use(router.allowedMethods());
// 开启端口监听
app.listen(8080, () => {
  console.log('Listening on 8080');
});
