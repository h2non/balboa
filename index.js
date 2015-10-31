const fs = require('fs')
const rocky = require('rocky')
const morgan = require('morgan')

module.exports = balboa

/**
 * Proxy server factory
 */

function balboa(opts) {
  opts = opts || {}
  if (opts.ssl) {
    return balboa.proxySSL(opts)
  }
  return balboa.proxy(opts)
}

/**
 * Creates a new proxy
 */

balboa.proxy = function (opts) {
  const proxy = rocky(opts)

  // Expose the default route
  if (!opts.noroute) proxy.route = proxy.routeAll()

  // Register middleware functions
  if (!opts.mute) proxy.use(morgan('combined'))
  proxy.useForward(forwardToTarget(opts.ssl ? 'https' : 'http'))

  // Start listening if port was defined
  if (+opts.port) proxy.listen(opts.port)

  return proxy
}

/**
 * Creates a SSL proxy
 */

balboa.proxySSL = function (opts) {
  if (!opts || !opts.ssl) {
    throw new TypeError('Missing required ssl options')
  }
  return balboa.proxy(opts)
}

/**
 * Exports the current version
 */

balboa.VERSION = require('./package.json').version

/**
 * Exports Rocky proxy
 */

balboa.rocky = rocky

/**
 * Forward to target middleware
 */

function forwardToTarget(protocol) {
  return function (req, res, next) {
    if (!req.headers.host) return next({ message: 'Missing host header' })

    req.rocky.options.target = protocol + '://' + req.headers.host
    req.rocky.options.secure = false

    next()
  }
}
