const path = require('path')
const fs = require('fs')
const fw = require('fw')
const expect = require('chai').expect
const spawn = require('child_process').spawn

const rootDir = path.join(__dirname, '..')
const examplesDir = path.join(rootDir, 'examples')

const ignore = [ 'README.md' ]

suite('examples', function () {
  test('run', function (done) {
    this.timeout(30 * 1000)

    var files = fs.readdirSync(examplesDir)
    fw.eachSeries(files, function (file, next) {
      if (~ignore.indexOf(file)) return next()

      var assert = false
      var examplePath = path.join(examplesDir, file)
      var child = spawn('node', [ examplePath ])

      child.stdout.on('data', function (chunk) {
        if (assert) return
        expect(chunk.toString()).to.not.match(/error/i)
        assert = true
        child.kill('SIGHUP')
        next()
      })

      child.stderr.on('data', function (chunk) {
        next(new Error(chunk.toString()))
      })

      child.on('close', function (code) {
        if (!assert) {
          next(new Error('Process exited for file ' + file + ' with code: ' + code))
        }
      })
    }, done)
  })
})
