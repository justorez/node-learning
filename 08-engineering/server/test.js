const server = require('./run')
const fs = require('fs')
const path = require('path')

const test = async () => {

  // 模拟从云端拉取业务代码
  const rootPath = path.join(__dirname, '../business/play')

  const data = await new Promise((resolve) => {
    fs.readFile(
      path.join(rootPath, 'data.js'), 'utf-8',
      (err, data) => resolve(data)
    )
  })

  const template = await new Promise((resolve) => {
    fs.readFile(
      path.join(rootPath, 'template.tpl'), 'utf-8',
      (err, data) => resolve(data)
    )
  })

  // 启动云服务
  server({
    '/play': {
      data,
      template
    }
  })
}

test()
