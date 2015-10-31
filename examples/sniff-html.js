const balboa = require('..')
const proxy = balboa()

proxy
  .route
  .transformResponseBody(function (req, res, next) {
    if (/html/i.test(res.getHeader('content-type')) ===  false) return next()

    var body = res.body.toString()
    // Compose the new body
    var newBody = body.replace(/<body(.*)>/, '<body$1><h1>HELLO WORLD</h1>')
    // Set the modified body
    next(null, newBody, 'utf8')
  })

proxy.listen(3000)
console.log('Proxy server listening on port:', 3000)
