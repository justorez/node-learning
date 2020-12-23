const requestors = {}

function factory(config) {
  if (!requestors[config.protocol] && !requestors['default']) {
    throw new Error(`暂不支持的协议: ${config.protocol}`)
  }

  // hook
  config.before = config.before || (d => d)
  config.then = config.then || (d => d)
  config.catch = config.catch || (d => d)

  requestors[config.protocol].compile(config) // 编译 RPC 客户端

  return async (data) => {
    try {
      data = config.before(data)

    } catch (e) {
      // 如果 beforeHook 抛出了错误，则交给catch处理。
      // 开发者可以在 before 抛出的 error 上挂属性来让 catch 做一些分辨逻辑。
      config.catch(e)
      // 如果 catchHook 没抛出其他错误，则认为此次请求是平安取消的
      return Promise.resolve(null)
    }

    return await requestors[config.protocol]
      .request(data)
      .then(config.then)
      .catch(config.catch) // 如果 config.catch 返回了 null，那整个请求过程其实不算失败
  }
}

/**
 * 注册新的数据源协议
 * @param {string} protocol 数据源协议名字
 * @param {function} requestor 请求流程定义
 */
factory.registerProtocol = (protocol, requestor) => {
  requestors[protocol] = requestor
}

module.exports = factory
