const net = require('net')

const server = net.createServer(socket => {
  socket.on('data', buffer => {
    const seqBuf = buffer.slice(0, 2)
    const id = buffer.readInt16BE(2)

    setTimeout(() => {
      const resBuf = Buffer.concat([
        seqBuf,
        Buffer.from(data[id])
      ])
      socket.write(resBuf)
    }, Math.random() * 1000)
  })
})

server.listen(4000)

const data = {
  23301: 'leo',
  23302: 'justorez',
  23303: 'alonezero'
}
