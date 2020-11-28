let seq = 0

function encode() {
  const buf = Buffer.alloc(4)
  buf.writeInt16BE(seq++)
  buf.writeInt16BE(Buffer.from('23301'), 2)
  return buf
}

const buf = encode()
console.log(buf.slice(0, 2).readInt16BE())
console.log(buf.readInt16BE(2))
