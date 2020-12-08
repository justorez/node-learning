const protobuf = require('protocol-buffers');
const fs = require('fs');
const schemas = protobuf(fs.readFileSync(`${__dirname}/../schema/comment.proto`));

const { createRPCClient } = require('../../utils/rpc-client');

const client = createRPCClient(
  { port: 4001 },
  schemas.CommentListRequest,
  schemas.CommentListResponse
);

module.exports = client;
