const express = require('express');

let app = express();

// 注册一个模板引擎
// app.engine('.html',express-art-template);
// 渲染文件的后缀名(引擎名称)
app.engine('.html',require('express-art-template'));
// 配置默认渲染引擎
app.set('view engine','.html');

// 区分开发和生产环节的不同配置
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
      // debug: 不压缩，不混淆，实时保持最新的数据
      // not debug: 压缩/合并，list.html 静态数据不回实时更新（服务器重启才更新）
    imports:{   
      // 数据的导入，和过滤显示的操作
      num:1,
      reverse: (str) => {
        let res = Array.from(str).reverse().join('');
        return `#${res}#`;
      }
    }
});

let router = express.Router();
router.get('/list',(req,res) => {
  res.render('list.html',{
    heros:[{name:'曹操'},{name:'孙权'},{name:'刘备'}]
  });
})

app.use(router);
app.listen(8080);
