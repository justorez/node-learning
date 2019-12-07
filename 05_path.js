// 引入核心对象
const path = require('path')

console.log(require.resolve('express'))

const myPath = path.join(__dirname, 'one', 'two')

console.log(myPath)
// console.log(path.sep)

// 根据相对路劲,返回绝对路径
const str = './abc/temp.js'
let result = path.resolve(str)
console.log(result)

// 路径字符串解析为路径对象
let pathObj = path.parse(result)
// {root:'',dir:'',base:'',ext:'',name:''}
console.log(pathObj)

// 路径对象格式化为路径字符串
let newPathObj = Object.assign({base:'new.js'}, pathObj)
let pathStr = path.format(newPathObj)
console.log(pathStr)