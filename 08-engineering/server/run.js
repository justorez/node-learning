const mount = require('koa-mount')
const createTemplate = require('./create-template')
const requestFactory = require('./request-factory')

requestFactory.registerProtocol('fake-rpc',
  require('./requestors/fake-rpc')
)
requestFactory.registerProtocol('http',
  require('./requestors/http')
)

module.exports = function (app) {
  const koa = new (require('koa'))

  koa.use(async (ctx, next) => {
    if (ctx.url == '/favicon.ico') {
      return
    }
    await next()
  })

  Object.keys(app).forEach(routepath => {

    const dataConfig = eval(app[routepath].data)

    const requests = Object.keys(dataConfig)
      .reduce((ret, key) => {
        ret[key] = requestFactory(dataConfig[key])
        return ret
      }, {})
    const template = createTemplate(app[routepath].template)

    koa.use(
      mount(routepath, async (ctx) => {
        ctx.status = 200

        const result = {}
        await Promise.all(
          Object.keys(requests).map(key => {
            return requests[key](ctx.query)
              .then(res => result[key] = res)
          })
        ).then(() => ctx.body = template(result))
      })
    )
  })

  koa.listen(3000, () => console.log('App run on http://localhost:3000'))
}
