'use strict'
const is = require('is-type-of')
const Account = require('./account')
const Transaction = require('./transaction')
const Block = require('./blockchain')
const Contract = require('./contract')
const  keyPair= require('./keypair')
module.exports = BIFCoreSDK

function BIFCoreSDK (options) {
    if (!(this instanceof BIFCoreSDK)) {
        return new BIFCoreSDK(options)
    }

    if (options && options.inited) {
        this.options = options
    } else {
        this.options = BIFCoreSDK.initOptions(options)
    }

    this.account = new Account(this.options)
    this.block = new Block(this.options)
    this.contract = new Contract(this.options)
    this.transaction = new Transaction(this.options)
    this.keypair= keyPair;
}

BIFCoreSDK.initOptions = function initOptions (options) {
    if (!is.object(options)) {
        throw new Error('options is require, it must be an object')
    }

    if (!is.string(options.host)) {
        throw new Error('host must be a non-empty string')
    }

    const chainId = options.chainId || 0
    const timeout = options.timeout || 15 * 1000

    if (!is.number(chainId)) {
        throw new Error('chainId must be a number')
    }

    if (!is.number(timeout)) {
        throw new Error('timeout must be a number')
    }

    const opts = {}

    Object.keys(options).forEach(key => {
        if (options[key] !== undefined) {
            opts[key] = options[key]
        }
    })

    opts.chainId = chainId
    opts.timeout = timeout
    opts.inited = true
    return opts
}
