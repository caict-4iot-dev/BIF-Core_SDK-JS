'use strict'
const Operation = require('../validate')
const errors = require('../exception')
const Transaction = require('../transaction')
const Query = require('../query')
const BigNumber = require('bignumber.js')
const keyPair = require('../keypair')
const is = require('is-type-of')
const config = require('../common/constant')
const util = require('../common/util')
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
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
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
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return util._responseData({
                address: info.result.address,
                balance: info.result.balance,
                nonce: info.result.nonce
            })
        }
        return info
    }
    /**
     * get account balance
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getAccountBalance (address) {
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return util._responseData({
                balance: info.result.balance
            })
        }
        return info
    }
    /**
      * get account privilege
      * @param request
      * @returns {Promise<{errorDesc: *, errorCode: *}>}
      */
    async getAccountPriv (address) {
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return util._responseData({
                address: info.result.address,
                priv: JSON.stringify(info.result.priv) || {}

            })
        }
        return info
    }
    /**
     * get account nonce
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getNonce (address) {
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return util._responseData({
                nonce: info.result.nonce
            })
        }
        return info
    }
    /**
     * get account metadatas
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getMetadatas (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
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
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { sourceAddress, privateKey, ceilLedgerSeq, remarks, destAddress, initBalance, feeLimit, gasPrice } = request

        if (ceilLedgerSeq != null && ceilLedgerSeq != '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice != '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }

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
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let createAccOperation = {
            to: destAddress,
            initBalance: initBalance
        }

        transaction.addOperation('activateAccount', createAccOperation)
        let nonceResult = await this.getNonce(sourceAddress)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        if (feeLimit == null || feeLimit == '') {
            feeLimit = config.feeLimit
        }
        if (gasPrice == null || gasPrice == '') {
            gasPrice = config.gasPrice
        }
        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq != '') {
            let blockNumber = await this.getBlockNumber()
            ceilLedgerSeq = Number(ceilLedgerSeq) + Number(blockNumber.header.blockNumber)
        }
        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: feeLimit,
            gasPrice: gasPrice,
            seqOffset: ceilLedgerSeq,
            metadata: remarks
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()
        return result
    }

    /**
     * set account metadatas
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async setMetadatas (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }

        let { sourceAddress, privateKey, remarks, key, value, version, deleteFlag, feeLimit, gasPrice, ceilLedgerSeq } = request

        if (ceilLedgerSeq != null && ceilLedgerSeq != '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice != '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }

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
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
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
            return nonceResult
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        if (feeLimit == null || feeLimit == '') {
            feeLimit = config.feeLimit
        }
        if (gasPrice == null || gasPrice == '') {
            gasPrice = config.gasPrice
        }
        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq != '') {
            let blockNumber = await this.getBlockNumber()
            ceilLedgerSeq = Number(ceilLedgerSeq) + Number(blockNumber.header.blockNumber)
        }
        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: feeLimit,
            gasPrice: gasPrice,
            metadata: remarks,
            seqOffset: ceilLedgerSeq
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
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }

        let { sourceAddress, privateKey, txThreshold, signers, typeThresholds, feeLimit, gasPrice, ceilLedgerSeq, remarks, masterWeight } = request

        if (ceilLedgerSeq != null && ceilLedgerSeq != '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice != '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }

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

        if (!keyPair.isAddress(sourceAddress)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }

        let setPrivilege = {
            txThreshold: txThreshold,
            signers: signers,
            typeThresholds: typeThresholds,
            masterWeight: masterWeight
        }

        transaction.addOperation('setPrivilegeOperation', setPrivilege)
        let nonceResult = await this.getNonce(sourceAddress)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }

        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        if (feeLimit == null || feeLimit == '') {
            feeLimit = config.feeLimit
        }
        if (gasPrice == null || gasPrice == '') {
            gasPrice = config.gasPrice
        }

        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq != '') {
            let blockNumber = await this.getBlockNumber()
            ceilLedgerSeq = Number(ceilLedgerSeq) + Number(blockNumber.header.blockNumber)
        }

        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: feeLimit,
            gasPrice: gasPrice,
            metadata: remarks,
            seqOffset: ceilLedgerSeq
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()

        return result
    }

    /**
    * getBlockNumber
    * @param request
    * @returns {Promise<{errorDesc: *, errorCode: *}>}
    */
    async getBlockNumber () {
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getBlockNumber()
    }

}
module.exports = Account
module.exports.CRYPTO_SM2 = CRYPTO_SM2
module.exports.CRYPTO_ED25519 = CRYPTO_ED25519
