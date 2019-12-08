// 接收命令行参数

// console.log(process.argv)

// 命令行加法计算器
// process.argv => [node_path, file_path, param_1, ...]

let num1 = Number(process.argv[2])
let num2 = Number(process.argv[3])

let sum = num1 + num2
console.log('计算中......')

setTimeout(() => {
  console.log(`结果：${sum}`)
}, 2000)

