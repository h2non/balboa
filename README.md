# balboa [![Build Status](https://api.travis-ci.org/h2non/balboa.svg?branch=master&style=flat)](https://travis-ci.org/h2non/balboa) [![NPM](https://img.shields.io/npm/v/balboa.svg)](https://www.npmjs.org/package/balboa)

Simple, programmatic and hackable node.js HTTP forward proxy built-on-top of [rocky](https://github.com/h2non/rocky).

Not designed for serious things, only for playground/development purposes.

<img src="http://cdn2.hubspot.net/hub/26878/file-13610973-png/images/forward_proxy-3.png" width="500" />

## Features

- Dead simple to set up
- Acts like a traditional HTTP forward proxy (e.g: Squid)
- Supports HTTP interceptors to modify request/response payloads
- Programmatically hackable (see [rocky API](https://github.com/h2non/rocky#programmatic-api))
- Command-line interface

## Whish list

- Full HTTPS support (forward TLS peer certificate)

## Installation

```bash
npm install -g balboa
```

For programmatic usage only install it in your dependency tree:
```bash
npm install balboa --save
```

## Usage

Start the forward proxy:
```bash
balboa -p 8080
```

Then you can configure your web browser to use `balboa` as proxy (Firefox proxy settings below):
<img src="http://i.imgur.com/eoC73LW.png" />

Finally, try browsing [some site](http://www.nytimes.com).

## Programmatic API

Simple programmatic set up of an HTTP proxy to sniff and transform HTML metadata:
```js
const balboa = require('balboa')
const proxy = balboa()

proxy
  .route
  .transformResponseBody(function (req, res, next) {
    if (/html/i.test(res.getHeader('content-type')) === false) return next()

    var body = res.body.toString()
    // Compose the new body
    var newBody = body.replace(/<body(.*)>/, '<body$1><h1>HELLO WORLD</h1>')
    // Set the modified body
    next(null, newBody, 'utf8')
  })

proxy.listen(8080)
console.log('Proxy server listening on port:', 8080)
```

### balboa([ opts ]) => [rocky](#balboarocky)

Creates a new HTTP or HTTPS proxy.

#### Supported options

See [rocky docs](https://github.com/h2non/rocky#configuration) for full supported options.

### balboa.proxy([ opts ]) => [rocky](#balboarocky)

Creates an HTTP proxy.

### balboa.proxySSL(opts) => [rocky](#balboarocky)

Creates a SSL proxy with the given options.
See an example [here](https://github.com/h2non/balboa/blob/master/examples/https.js).

### balboa.VERSION

Current package version

### balboa.rocky

Rocky proxy. See full API docs [here](https://github.com/h2non/rocky#rocky-options-).

## License

MIT - Tomas Aparicio
