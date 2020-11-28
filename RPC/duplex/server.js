const net = require('net');
const { checkComplete, LESSON_DATA } = require('./utils');

const server = net.createServer((socket) => {

  let oldBuffer = null;
  socket.on('data', function (buffer) {
    // 把上一次 data 事件使用残余的 buffer 接上来
    if (oldBuffer) {
      buffer = Buffer.concat([oldBuffer, buffer]);
    }

    let packageLength = 0;
    // 只要还存在可以解成完整包的包长
    while (packageLength = checkComplete(buffer)) {
      const package = buffer.slice(0, packageLength);
      buffer = buffer.slice(packageLength);

      const result = decode(package); // 把这个包解成数据和 seq

      // 计算得到要返回的结果，并 write 返回
      socket.write(
        encode(LESSON_DATA[result.data], result.seq)
      );
    }

    oldBuffer = buffer; // 把残余的 buffer 记下来
  })

});

server.listen(4000);

/**
 * 二进制包编码函数
 */
function encode(data, seq) {
  // 正常情况下，这里应该是使用 protobuf 来 encode 一段代表业务数据的数据包
  // 例子比较简单，直接把课程标题转 buffer 返回
  const body = Buffer.from(data);

  // 一般来说，一个 rpc 调用的数据包会分为定长的包头和不定长的包体两部分
  // 包头的作用就是用来记载包的序号和包的长度，以实现全双工通信
  const header = Buffer.alloc(6);
  header.writeInt16BE(seq)
  header.writeInt32BE(body.length, 2);

  return Buffer.concat([header, body]);
}

/**
 * 二进制包解码函数
 * @return {} {seq, data}
 */
function decode(buffer) {
  const header = buffer.slice(0, 6);
  const seq = header.readInt16BE();

  const body = buffer.slice(6).readInt32BE()

  return {
    seq,
    data: body
  }
}
