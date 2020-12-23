const fs = require('fs')
const protobuf = require('protocol-buffers');
const schemas = protobuf(
  fs.readFileSync(`${__dirname}/proto/detail.proto`)
);

// 假数据
const columnData = require('./mockdata/column')

/**
 * 服务端的编解包逻辑
 */
const server = require('./lib/geeknode-rpc-server')(schemas.ColumnRequest, schemas.ColumnResponse);

server
  .createServer((request, response) => {
    // 真实项目会拿这个 columnid 去请求数据库
    const { columnid } = request.body;
    const column = columnData.find(col => col.id === columnid) || columnData[0];
    const otherColumns = columnData.filter(col => col.id !== columnid);

    // 直接返回假数据
    response.end({
      column,
      recommendColumns: [otherColumns[1], otherColumns[2]]
    });
  })
  .listen(4000, () => {
    console.log('detail rpc server listening: 4000')
  });
