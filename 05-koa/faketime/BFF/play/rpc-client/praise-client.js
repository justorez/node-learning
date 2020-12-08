const protobuf = require('protocol-buffers');
const fs = require('fs');
const schemas = protobuf(fs.readFileSync(`${__dirname}/../schema/comment.proto`));

const { createRPCClient } = require('../../utils/rpc-client');

const client = createRPCClient(
  { port: 4002 },
  schemas.PraiseRequest,
  schemas.PraiseResponse
);

module.exports = client;
