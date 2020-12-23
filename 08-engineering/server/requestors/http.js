const request = require('request')

let url = ''

module.exports = {
  compile: (config) => url = config.url,

  request: async (data) => {
    return await new Promise((resolve, reject) => {
      request(url, (err, data) => {
        err ? reject(err) : resolve(data.body);
      })
    })
  }
}
