'use strict';

const BIFCoreSDK = require('./lib/sdk');

if (typeof window !== 'undefined' && typeof window.BIFCoreSDK === 'undefined') {
  window.BIFCoreSDK = BIFCoreSDK;
}

module.exports = BIFCoreSDK;
