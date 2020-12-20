const listClient = require('./client');

module.exports = async (sortType = 0, filtType = 0) => {

  // 使用微服务拉取数据
  const data = await new Promise((resolve, reject) => {
    listClient.write({
      sortType,
      filtType
    }, (err, res) => err ? reject(err) : resolve(res.columns))
  });

  return data
}
