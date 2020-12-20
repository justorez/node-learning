const EasySock = require('easy_sock');

const protobuf = require('protocol-buffers')
const fs = require('fs');
const schemas = protobuf(fs.readFileSync(`${__dirname}/schema/list.proto`));

const { createRPCClient } = require('../../utils/rpc-client');

const client = createRPCClient(
  { port: 4003 },
  schemas.ListRequest,
  schemas.ListResponse
);

module.exports = client;
