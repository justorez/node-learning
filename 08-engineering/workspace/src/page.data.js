module.exports = {
  column: {
    protocol: 'fake-rpc',

    ip: '127.0.0.1',
    port: 4000,
    protobufFile: require(`${__dirname}/proto/detail.proto`),
    requestStruct: 'ColumnRequest',
    responseStruct: 'ColumnResponse',

    then(res) {
      return res.column
    }
  },
  articleList: {
    protocol: 'http',

    url: 'http://127.0.0.1:4003',

    before(data) {
      return data;
    },

    then(res) {
      return JSON.parse(res).data.list
    },

    catch(err) {
      console.error('[articleList]', err.message)
      throw err // 抛出错误，则代表请求失败，不会渲染模板；否则请求并不算失败
    }
  }
}
