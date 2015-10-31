const fs = require('fs')
const balboa = require('..')
const certPath = __dirname + '/../test/fixtures'

const opts = {
  ssl: {
    key: fs.readFileSync(certPath + '/key.pem', 'utf8'),
    cert: fs.readFileSync(certPath + '/cert.pem', 'utf8')
  }
}

balboa(opts).listen(3443)
console.log('SSL proxy server listening on port:', 3443)
