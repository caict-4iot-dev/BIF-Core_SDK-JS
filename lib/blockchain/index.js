'use strict'
const Query = require('../query')
const util = require('../common/util')
const is = require('is-type-of')
const errors = require('../exception')
class block {
    constructor(options = {}) {
        this.host = options.host
    }
    /**
     * get block info
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getBlockInfo (blockNumber) {
        if (!is.undefined(blockNumber) && !util._verifyValue(blockNumber)) {
            return util._responseError(errors.INVALID_BLOCKNUMBER_ERROR)
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getBlockInfo(blockNumber)

    }
    /**
     * get block number
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getBlockNumber () {
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getBlockNumber()
    }
    /**
     * get transaction info by blocknumber
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getTransactions (blockNumber) {
        if (!is.undefined(blockNumber) && !util._verifyValue(blockNumber)) {
            return util._responseError(errors.INVALID_BLOCKNUMBER_ERROR)
        }

        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getTransactions(blockNumber)
    }
    /**
     * get block latest info
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */

    async getBlockLatestInfo () {
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getBlockLatestInfo()
    }

    async getValidators (blockNumber) {
        if (!is.undefined(blockNumber) && !util._verifyValue(blockNumber)) {
            return util._responseError(errors.INVALID_BLOCKNUMBER_ERROR)
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getValidators(blockNumber)
    }

    async getLatestValidators () {
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getLatestValidators()
    }

}

module.exports = block
