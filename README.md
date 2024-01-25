bifcore-sdk-nodejs
=======

Let developers can all use bifcore services more easily.


## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 6.0.0 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install bifcore-sdk-nodejs --save
```


## Quick Start

  Create bifcore-sdk-nodejs instance:

```js
'use strict' 

const BIFCoreSDK = require('bifcore-sdk-nodejs');

const sdk = new BIFCoreSDK({
  host: 'http://test.bifcore.bitfactory.cn'
});

```


## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## Docs

  * [Documentation](doc/BIFCore-SDK-Nodejs.md)

## License

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

版权所有 2021 中国信息通信研究院工业互联网与物联网研究所
