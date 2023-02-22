'use strict'
const Query = require('../query')
const util = require('../common/util')
const is = require('is-type-of')
const errors = require('../exception')
const config = require('../common/constant')
class block {
    constructor(options = {}) {
        this.host = options.host
    }
    /**
     * get block info
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getBlockInfo (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { blockNumber, domainId } = request
        if (!is.undefined(blockNumber) && !util._verifyValue(blockNumber)) {
            return util._responseError(errors.INVALID_BLOCKNUMBER_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getBlockInfo(blockNumber, domainId)

    }
    /**
     * get block number
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getBlockNumber (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { domainId } = request
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getBlockNumber(domainId)
    }
    /**
     * get transaction info by blocknumber
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getTransactions (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { domainId, blockNumber } = request
        if (!is.undefined(blockNumber) && !util._verifyValue(blockNumber)) {
            return util._responseError(errors.INVALID_BLOCKNUMBER_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getTransactions(blockNumber, domainId)
    }
    /**
     * get block latest info
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */

    async getBlockLatestInfo (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { domainId } = request
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getBlockLatestInfo(domainId)
    }

    async getValidators (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { blockNumber, domainId } = request
        if (!is.undefined(blockNumber) && !util._verifyValue(blockNumber)) {
            return util._responseError(errors.INVALID_BLOCKNUMBER_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getValidators(blockNumber, domainId)
    }

    async getLatestValidators (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { domainId } = request
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getLatestValidators(domainId)
    }

}

module.exports = block
