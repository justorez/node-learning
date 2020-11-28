const fs = require('fs');
const protobuf = require('protocol-buffers');

// protocol-buffers 是一种数据序列化格式
// Buffer 直接将对象写成二进制数据包不方便，所以可借助 protocol-buffers 完成
// 在 RPC 调用中，使用的协议是二进制数据协议，所以需要这种数据与二进制数据的转换方法

// 根据协议，编译出一个 js 逻辑对象，里面包含 encode 和 decode 函数
// 实际写 web 服务器的时候，注意这个操作可以直接在进程启动就做
// 否则在 http 处理过程里做的话，是一次不必要的性能消耗
const schemas = protobuf(fs.readFileSync(`${__dirname}/test.proto`));

const buffer = schemas.Course.encode({
  id: 4,
  name: 'node.js',
  lesson: []
})
console.log(buffer);

const course = schemas.Course.decode(buffer)
console.log(typeof course, course);
