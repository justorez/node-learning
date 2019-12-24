/**
 * Websocket 服务器和客户端全双工通信
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

// 全局变量: global
// { '1577192512079': {socketid:/#I4LARR47CSu5pd1EAAAB ,username} }
global.ioStore = {
  storage:{},
  add(userId, obj) {
    this.storage[userId] = obj;
  },
  set(userId, socketid) {
    this.storage[userId].socketid = socketid;
  },
  get(socketid) {
    for (let timestamp in this.storage) {
      let obj = this.storage[timestamp];
      if (obj.socketid === socketid) {
        return obj;
      }
    }
  },
  remove(userId) {
    delete this.storage[userId];
  },
  count() {
    return Object.keys(this.storage).length;
  }
};

let app = new Koa();

const IO = require('koa-socket-2');
const io = new IO();
io.attach(app);

io.on('connection', ctx => {
  console.log('当前在线用户数:', global.ioStore.count());
  io.broadcast('msg', '热烈欢迎~');
});
// 接收用户的消息
io.on('sendMsg', (ctx, data) => {
  console.log('>>', data);
  // ctx.socket (客户端的那个连接)
  // ctx.socket.socket.id 私聊用的

  //查找发消息的用户
  let obj = global.ioStore.get(ctx.socket.id);
  let newMsg = {
    username: obj.username,
    content: data,
  };
  msgs.push(newMsg);

  // 广播给所有人
  io.broadcast('allMsg', newMsg);
});
// 处理登录，同步消息
io.on('login', (ctx, data) => {
  let id = data.id;
  console.log(id, ctx.socket.id);
  global.ioStore.set(id, ctx.socket.id);
});
// 处理退出
io.on('exit', (ctx, userId) => {
  let user = global.ioStore.get(ctx.socket.id);
  console.log(`用户<${user.username}>下线`);
  global.ioStore.remove(userId);
});

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
    let { username, password } = ctx.request.body;
    let user = {
      username: username || '无名氏'
    };
    
    // 不验证直接挂在 session 上
    ctx.session.user = user;

    // 生成时间戳将时间戳响应给客户端(类似cookie)
    let id = String(Date.now());
    ctx.session.user.id = id;
    // 保存到自己的 sessionStroe 中
    global.ioStore.add(id, user);

    // 重定向到聊天室
    ctx.redirect('/list');
  })
  .get('/list', ctx => {
    ctx.render('list_ws', {
      username: ctx.session.user.username,
      id: ctx.session.user.id,
      msgs
    });
  });

// 签名的依据
app.keys = ['2019-12-24 20:51:25'];

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
app.use(session({store},app));
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
