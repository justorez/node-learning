const net = require('net');
const { checkComplete, LESSON_IDS } = require('./utils');

const socket = new net.Socket({});

socket.connect({
  host: '127.0.0.1',
  port: 4000
});

let oldBuffer = null;
socket.on('data', (buffer) => {
  // 把上一次 data 事件使用残余的 buffer 接上来
  if (oldBuffer) {
    buffer = Buffer.concat([oldBuffer, buffer]);
  }

  let completeLength = 0;

  // 只要还存在可以解成完整包的包长
  while (completeLength = checkComplete(buffer)) {
    const package = buffer.slice(0, completeLength);
    buffer = buffer.slice(completeLength);

    const result = decode(package); // 把这个包解成数据和 seq
    console.log(`No.${result.seq} package, response is ${result.data}`);
  }

  oldBuffer = buffer; // 把残余的 buffer 记下来
})


let seq = 0;
/**
 * 二进制包编码函数
 */
function encode(data) {
  const body = Buffer.alloc(4);
  body.writeInt32BE(LESSON_IDS[data.id]);

  const header = Buffer.alloc(6);
  header.writeInt16BE(seq++)
  header.writeInt32BE(body.length, 2);

  // 包头和包体拼起来发送
  const buffer = Buffer.concat([header, body])

  return buffer;
}

/**
 * 二进制包解码函数
 */
function decode(buffer) {
  const header = buffer.slice(0, 6);
  const seq = header.readInt16BE();

  const body = buffer.slice(6)

  return {
    seq,
    data: body.toString()
  }
}

// 发送数据
// TCP 的机制会把一段时间内的包进行拼接，一次发送，称为：粘包
// 为了正确解析包数据，需要手动处理粘包问题
for (let k = 0; k < 100; k++) {
  let id = Math.floor(Math.random() * LESSON_IDS.length);

  console.log(`No.${seq} package lessionId: ${LESSON_IDS[id]}`);
  socket.write(encode({ id }));
}
