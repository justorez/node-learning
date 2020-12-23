const uploader = require('./uploader')
const path = require('path')

// 真实场景应该是把打包后的代码上传到云服务上
uploader(
  'play',
  path.join(__dirname, 'src/page.data.js'),
  path.join(__dirname, 'src/play.template.html')
)
