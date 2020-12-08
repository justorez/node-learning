const EasySock = require('easy_sock');

/**
 * 创建 EasySock RPC Client
 * @param {object} options easysock 初始化配置
 * @param {object} protobufRequestSchema protobuf request schema
 * @param {object} protobufResponseSchema protobuf response schema
 */
function createRPCClient(options, protobufRequestSchema, protobufResponseSchema) {
  const easySock = new EasySock({
    ip: '127.0.0.1',
    port: options.port,
    timeout: 500,
    keepAlive: true
  });

  easySock.encode = function (data, seq) {
    const body = protobufRequestSchema.encode(data);

    const head = Buffer.alloc(8);
    head.writeInt32BE(seq);
    head.writeInt32BE(body.length, 4);

    return Buffer.concat([head, body])
  }
  easySock.decode = function (buffer) {
    const seq = buffer.readInt32BE();
    const body = protobufResponseSchema.decode(buffer.slice(8));

    return {
      result: body,
      seq
    }
  }
  easySock.isReceiveComplete = function (buffer) {
    if (buffer.length < 8) {
      return 0
    }
    const bodyLength = buffer.readInt32BE(4);

    if (buffer.length >= bodyLength + 8) {
      return bodyLength + 8

    } else {
      return 0
    }
  }

  return easySock;
}

module.exports = {
  createRPCClient
}
