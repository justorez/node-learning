const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
let app = express();
const db = require('./dbTools.js');
const https = require('https');

const MY_LOCATION = "116.31257,40.059138";

// 设置模板
app.engine('.html', require('express-art-template'));
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production',
});
app.set('view engine', '.html');

// 设置路由
let router = express.Router();
router
  .get('/', (req, res, next) => {
    let cookie = req.headers.cookie;
    
    if (!cookie) {
      return res.render('index',{heros: []});
    }
    
    let loc = {l:0.0,r:0.0};
    let r = /location=(.*,.*);{0,1}/i;
    if (r.test(cookie)) {
      let location = cookie.match(r)[1].split(',');
      loc.l = parseFloat(location[0]);
      loc.r = parseFloat(location[1]);
    }
    
    db.findNear('heros', loc, (err, docs) => {
      if (err) throw err;
      res.render('index', {heros: docs})
    });
  })
  .post('/add', (req, res, next) => {
    let form = new formidable.IncomingForm();
    
    let uploadDir = 'upload';
    // 修改上传目录
    form.uploadDir = path.join(__dirname, 'public', uploadDir);
    // 保持原有后缀名
    form.keepExtensions = true;

    // 解析
    form.parse(req, (err, fields, files) => {
      let nickname = fields.nickname;
      let filename = path.parse(files.avater.path).base;
      let location = MY_LOCATION;
      if (fields.location) {
        location = fields.location;
      }
      let arr = location.split(',');
      let longitude_l = parseFloat(arr[0]);
      let latitude_r = parseFloat(arr[1]);
      console.log(longitude_l, latitude_r);
      
      let img = `${uploadDir}/${filename}`;

      db.insert('heros', [{
        nickname,
        img,
        sp: {
          type: "Point",
          coordinates: [longitude_l, latitude_r]
        }
      }], (err, results) => {
        if (err) throw err;
        // 同步提交，浏览器等待页面显示
        res.setHeader('set-cookie', 'location=' + location);
        res.redirect('/');
      });
    });
  })
  .all('*', (req, res) => {
    res.send('404 警告！');
  });

// 处理图片
// /upload/upload_5304f504b298af0f0330f9d0c77ea3c9.jpg
app.use(express.static('./public'));
app.use(router);


// 处理错误(参数位置错误优先) -> 优雅的用户体验
app.use((err, req, res, next) => {
  console.log(err);
  res.send('<h2>服务器君抽风了...<a href="/">去首页看看吧</a></h2>');
});

function resolvePath(dest) {
  return path.join(__dirname, dest);
}

// 配置 https
const options = {
  key: fs.readFileSync(resolvePath('./cert/1530632509237.key')),
  cert: fs.readFileSync(resolvePath('./cert/1530632509237.pem'))
};
let server = https.createServer(options, app);

server.listen(8080, () => {
  console.log('https://localhost:8080');
});
