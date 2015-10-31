const fs = require('fs')
const http = require('http')
const balboa = require('..')
const request = require('request')
const expect = require('chai').expect
const certPath = __dirname + '/fixtures'

suite('balboa', function () {
  after(function () {
    process.env.http_proxy = ''
  })

  test('simple proxy', function (done) {
    const server = createServer(4001, 200)

    var proxied = false
    const proxy = balboa({ port: 4000 })
      .useForward(function (req, res, next) {
        proxied = true
        next()
      })

    process.env.http_proxy = 'http://localhost:4000'
    request('http://localhost:4001', function (err, res) {
      expect(err).to.be.null
      expect(proxied).to.be.true
      expect(res.statusCode).to.be.equal(200)
      expect(JSON.parse(res.body)).to.be.deep.equal({ hello: 'world' })
      proxy.close(done)
    })
  })
})

function createServer(port, code, assert, timeout) {
  var server = http.createServer(function (req, res) {
    setTimeout(handler, +timeout || 1)

    function handler() {
      res.writeHead(code, { 'Content-Type': 'application/json' })
      res.write(JSON.stringify({ 'hello': 'world' }))

      var body = ''
      req.on('data', function (data) {
        body += data
      })
      req.on('end', function () {
        req.body = body
        end()
      })
    }

    function end() {
      if (assert) assert(req, res)
      res.end()
    }
  })

  server.listen(port)
  return server
}
