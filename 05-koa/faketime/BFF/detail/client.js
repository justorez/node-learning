const protobuf = require('protocol-buffers')
const fs = require('fs');
const schemas = protobuf(fs.readFileSync(`${__dirname}/schema/detail.proto`));

const { createRPCClient } = require('../utils/rpc-client');

const client = createRPCClient(
  { port: 4000 },
  schemas.ColumnRequest,
  schemas.ColumnResponse
);

module.exports = client;
