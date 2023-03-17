#  Entry name

bifcore-sdk-nodejs,the interface between Spark Chain Network and underlying blockchain platform is provided through API call

## Functional characteristics

The BIF-Core-SDK provides interfaces such as Spark Chain-underlying blockchain platform public and private key pair generation, Spark Chain-underlying blockchain platform private key signature public key verification, account service, block service, transaction service, etc. through API calls. At the same time, it also provides interface use examples to illustrate that developers can call the SDK to easily and quickly generate fast access to the main chain of Spark Chain.Let developers can all use bifcore services more easily.

## Quick Start

  Create bifcore-sdk-nodejs instance:

```js
'use strict' 

const BIFCoreSDK = require('bifcore-sdk-nodejs');

const sdk = new BIFCoreSDK({
  host: 'http://test-bif-core.xinghuo.space'
});

```


### Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 6.0.0 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install bifcore-sdk-nodejs --save
```

### Structure

To run the test suite, first install the dependencies:

```bash
$ npm install
```

### Function

then run `npm test`:

```
$ npm test
```

## Use guide

- Bif-chain-sdk-js directory: BIF-Core-SDK-JS open source code  
- Bif-chain-sdk-js-example directory: BIF-Core-SDK-JS development kit demonstration example
- [Documentation](doc/BIFCore-SDK-Nodejs.md)

## How to contribute

Welcome to participate in the ecological construction of the main chain service of "Spark · Chain Network":

1. If the project is helpful to you, please light up our little star (click the Star button above the project).

2. Welcome to submit code (Pull requests).

3. Ask questions and submit BUGs.

4. Email feedback: guoshijie@caict.ac.cn

We will reply as soon as possible.

## About the author

Adhering to the concept of open source and openness, the CAICT has fully opened the Spark "BID-Core-SDK-JS" to the community and the public, helping partners in the whole industry to improve the efficiency of data value circulation and achieve data value transformation.

## License

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

版权所有 2023 中国信息通信研究院工业互联网与物联网研究所