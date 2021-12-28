'use strict'
const Operation = require('../validate')
const errors = require('../exception')
const Transaction = require('../transaction')
const Query = require('../query')
const BigNumber = require('bignumber.js')
const keyPair = require('../keypair')
const is = require('is-type-of')
const config = require('../common/constant')
const unit = require('../common/util')

const CRYPTO_SM2 = 0x7a
const CRYPTO_ED25519 = 0x65
class Account {
    constructor(options = {}) {
        this.host = options.host
    }

    /**
     * Get account base information
     * @param  {String} address
     * @return {Object}
     */
    async getInfo (address) {
        if (!keyPair.isAddress(address)) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getInfo(address)
    };
    /**
     * get account info
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getAccount (address) {
        if (!is.string(address) || address.trim().length === 0) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return unit._responseData({
                address: info.result.address,
                balance: info.result.balance,
                nonce: info.result.nonce
            })
        }
        return unit._responseError(errors.INVALID_ADDRESS_ERROR)
    }
    /**
     * get account balance
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getAccountBalance (address) {
        if (!is.string(address) || address.trim().length === 0) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return unit._responseData({
                balance: info.result.balance
            })
        }
        return unit._responseError(errors.INVALID_ADDRESS_ERROR)
    }
    /**
      * get account privilege
      * @param request
      * @returns {Promise<{errorDesc: *, errorCode: *}>}
      */
    async getAccountPriv (address) {
        if (!is.string(address) || address.trim().length === 0) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return unit._responseData({
                address: info.result.address,
                priv: JSON.stringify(info.result.priv) || {}

            })
        }
        return unit._responseError(errors.INVALID_ADDRESS_ERROR)
    }
    /**
     * get account nonce
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getNonce (address) {
        if (!is.string(address) || address.trim().length === 0) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return unit._responseData({
                nonce: info.result.nonce
            })
        }
        return unit._responseError(errors.INVALID_ADDRESS_ERROR)
    }
    /**
     * get account metadatas
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getMetadatas (request = {}) {
        if (!is.array(request) || !is.object(request)) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getMetadatas(request)
    }

    /**
     * create account
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async createAccount (request = {}) {
        let { sourceAddress, privateKey, ceilLedgerSeq, remarks, destAddress, initBalance } = request
        let operation = new Operation()
        let data = operation.accountActivateOperation(request)
        if (data.errorCode !== 0) {
            return data
        }
        let options = {
            host: this.host
        }
        let transaction = new Transaction(options)

        if (!keyPair.isAddress(sourceAddress)) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let createAccOperation = {
            to: destAddress,
            initBalance: initBalance
        }

        transaction.addOperation('activateAccount', createAccOperation)
        let nonceResult = await this.getNonce(sourceAddress)
        if (nonceResult.errorCode !== 0) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: config.feeLimit,
            gasPrice: config.gasPrice,
            seqOffset: ceilLedgerSeq,
            metadata: remarks
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()
        console.log("result: ",result)
        return result
    }

    /**
     * set account metadatas
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async setMetadatas (request = {}) {
        let { sourceAddress, privateKey, remarks, key, value, version, deleteFlag } = request
        // 参数校验
        let operation = new Operation()
        let data = operation.accountSetMetadataOperation(request)
        if (data.errorCode !== 0) {
            return data
        }

        let options = {
            host: this.host
        }
        let transaction = new Transaction(options)

        if (!keyPair.isAddress(sourceAddress)) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let setMetadatas = {
            key: key,
            value: value,
            version: version,
            deleteFlag: deleteFlag
        }

        transaction.addOperation('setMetadata', setMetadatas)
        let nonceResult = await this.getNonce(sourceAddress)
        if (nonceResult.errorCode !== 0) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: config.feeLimit,
            gasPrice: config.gasPrice,
            metadata: remarks
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()

        return result
    }

    /**
     * set account privilege
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async setPrivilege (request = {}) {
        // 参数校验
        let operation = new Operation()
        let data = operation.accountSetPrivilegeOperation(request)
        if (data.errorCode !== 0) {
            return data
        }

        let options = {
            host: this.host
        }
        let transaction = new Transaction(options)

        if (!keyPair.isAddress(request.sourceAddress)) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let setPrivilege = {
            txThreshold: request.txThreshold,
            signers: request.signers,
            typeThresholds: request.typeThresholds
        }

        transaction.addOperation('setPrivilegeOperation', setPrivilege)
        let nonceResult = await this.getNonce(request.sourceAddress)
        if (nonceResult.errorCode !== 0) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }

        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        let tranactionParameter = {
            sourceAddress: request.sourceAddress,
            nonce: nonce,
            feeLimit: config.feeLimit,
            gasPrice: config.gasPrice,
            metadata: request.remarks,
            masterWeight: request.masterWeight
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [request.privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()

        return result
    }
}
module.exports = Account
module.exports.CRYPTO_SM2 = CRYPTO_SM2
module.exports.CRYPTO_ED25519 = CRYPTO_ED25519
