const fs = require('fs')
const protobuf = require('protocol-buffers');
const schemas = protobuf(
  fs.readFileSync(`${__dirname}/schema/list.proto`)
);

// 假数据
const columnData = require('./mockdata/column')

/**
 * 服务端的编解包逻辑
 */
const server = require('./lib/geeknode-rpc-server')(schemas.ListRequest, schemas.ListResponse);

server
  .createServer((request, response) => {
    const { sortType, filtType } = request.body;

    // 直接返回假数据
    response.end({
      columns: columnData
        .sort((a, b) => {
          if (sortType == 1) {
            return a.id - b.id

          } else if (sortType == 2) {
            return a.sub_count - b.sub_count

          } else if (sortType == 3) {
            return a.column_price - b.column_price
          }
        })
        .filter((item) => (filtType == 0) ? item : (item.type == filtType))
    });
  })
  .listen(4003, () => {
    console.log('rpc server listening on 4003')
  });
