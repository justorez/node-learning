// 遍历命令行参数传入的目录
const fs = require("fs");
const path = require("path");

function readFiles(dir) {
  let state = fs.statSync(dir);
  if (state.isFile()) {
    console.log(dir);
  } else if (state.isDirectory()) {
    console.log('==================================================')
    let files = fs.readdirSync(dir);
    files.forEach(file => {
      readFiles(path.join(dir, file));
    })
  }
}

let inputPath = path.resolve(process.argv[2]);

if (!fs.existsSync(inputPath)) {
  console.log("无效路径");
} else {
  readFiles(inputPath);
}
