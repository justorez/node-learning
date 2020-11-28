const net = require('net')

const socket = new net.Socket({})

const ids = [
  '23301',
  '23302',
  '23303',
]
let seq = 0 // 数据包序列号；解决全双工通信的数据对应问题

function encode(index) {
  const buf = Buffer.alloc(4)
  buf.writeInt16BE(seq)
  buf.writeInt16BE(Buffer.from(ids[idx]), 2)
  console.log('>>', seq++, ids[idx])
  return buf
}

socket.connect({
  host: '127.0.0.1',
  port: 4000
})

let idx = Math.floor(Math.random() * ids.length);
socket.write(encode(idx))

socket.on('data', buffer => {
  const seqBuf = buffer.slice(0, 2)
  const nameBuf = buffer.slice(2)
  console.log('<<', seqBuf.readInt16BE(), nameBuf.toString())
})

setInterval(() => {
  idx = Math.floor(Math.random() * ids.length)
  socket.write(encode(idx))
}, 500);
