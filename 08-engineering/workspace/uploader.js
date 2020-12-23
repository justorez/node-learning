const path =require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const webpack = require('webpack')
const mfs = new (require('memory-fs'))

module.exports = function (
  businessName,
  dataJSPath,
  templatePath
) {
  const distPath = path.join(__dirname, '../business', businessName)

  mkdirp.sync(distPath)

  fs.createReadStream(templatePath)
    .pipe(fs.createWriteStream(`${distPath}/template.tpl`))

  const compileTask = webpack({
    mode: 'development',
    devtool: false,
    target: 'node',
    entry: dataJSPath,
    module: {
      rules: [
        { test: /.proto$/, use: 'text-loader' }
      ]
    },
    output: {
      path: '/whatever',
      filename: 'data.js'
    }
  })

  compileTask.outputFileSystem = mfs

  compileTask.run((err, stats) => {
    if (err) {
      return console.error(err)
    }

    const content = mfs.readFileSync('/whatever/data.js')
    fs.writeFileSync(`${distPath}/data.js`, content)

    const result = stats.toString({
      colors: true,
      modules: false,
      children: false
    })
    console.log(result, '\n\n')
  })
}
