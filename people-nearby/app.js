const express = require('express');
const fs = require('fs');
const formidable = require('formidable');
const path = require('path');
let app = express();
const db = require('./dbTools.js');
const https = require('https');

function getAbsolutePath(dest) {
  return path.join(__dirname, dest);
}

const options = {
  key: fs.readFileSync(getAbsolutePath('./cert/1530632509237.key')),
  cert: fs.readFileSync(getAbsolutePath('./cert/1530632509237.pem'))
};
let server = https.createServer(options, app);

let heros = [];

app.engine('.html', require('express-art-template'));

app.set('view options', {
  debug: process.env.NODE_ENV !== 'production',
});

// 配置默认渲染引擎
app.set('view engine', '.html');

let router = express.Router();
router
  .get('/list', (req, res, next) => {
    if (!req.headers.cookie) {
      return res.json({
        msg: 'bye,没记录'
      });
    }
    let location = req.headers.cookie.match(/location=(.*,.*);{0,1}/i)[1];
    location = location.split(',');
    let l = parseFloat(location[1]);
    let r = parseFloat(location[0]);
    
    db.findNear('heros', {l,r}, function(err, documents) {
      if (err) {
        console.log(err);
      }
      console.log(documents);
      // calculated
      res.render('list', {
        heros: documents, // ES6属性简写，key和value是同名的
      })
    });
  })
  .get('/', (req, res, next) => {
    res.render('index');
  })
  .post('/add', (req, res, next) => {
    // 解析文件,用包
    var form = new formidable.IncomingForm();

    // 修改上传目录
    form.uploadDir = path.join(__dirname, 'public', 'imgs');
    // 保持原有后缀名
    form.keepExtensions = true;

    // 解析
    form.parse(req, function(err, fields, files) {
      // console.log(fields);  // fields.nickname
      // files.avater.path
      // path.parse(路径).base文件名
      // console.log(files);

      let nickname = fields.nickname;
      let filename = path.parse(files.avater.path).base;
      let location = fields.location.split(',');
      let longitude_l = location[1] - 0;
      let latitude_r = location[0] - 0;
      console.log(longitude_l, latitude_r);
      
      // 存储 img: 网络能请求道的路径    upload/uploadxxx.js
      let img = 'upload/' + filename;

      db.insert('heros', [{
        nickname,
        img,
        sp: {
          type: "Point",
          coordinates: [longitude_l, latitude_r]
        }
      }], function(err, results) {
        if (err) throw err;
        console.log(results);
        // 同步提交，浏览器等待页面显示
        res.setHeader('set-cookie', 'location=' + location);
        res.redirect('/list');
      });


    });
  })
  // 最后一条路由中
  .all('*', (req, res) => {
    res.send('地址错误，您去首页吧');
  });
  

// 处理图片
app.use(express.static('./public'));
// /upload/upload_5304f504b298af0f0330f9d0c77ea3c9.jpg

app.use(router);


// 处理错误(参数位置错误优先) -> 优雅的用户体验
app.use((err, req, res, next) => {
  console.log(err);
  res.send('<h1>亲爱的用户，您访问的页面，有事儿了,<a href="/">去首页看看?</a></h1>');
});

server.listen(2333, () => {
  console.log('http://localhost:2333');
});
