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
    async getInfo (address, domainId) {
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
        return query.getInfo(address, domainId)
    };
    /**
     * get account info
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getAccount (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { address, domainId } = request
        let info = await this.getInfo(address, domainId)
        if (info.errorCode === 0) {
            return util._responseData({
                address: info.result.address,
                balance: info.result.balance,
                nonce: info.result.nonce
            })
        }
        if (info.errorCode !== 0 && info.errorCode == config.ERRORCODE) {
            let infos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'Account (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return infos
        } else if (info.errorCode !== 0 && info.errorCode == config.DOMAINID_ERRORCODE) {
            let domainIdInfos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'DomainId (' + domainId + ') (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return domainIdInfos
        } else if (info.errorCode !== 0) {
            return util._response(info)
        }

    }
    /**
     * get account balance
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getAccountBalance (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { address, domainId } = request
        let info = await this.getInfo(address, domainId)
        if (info.errorCode === 0) {
            return util._responseData({
                balance: info.result.balance
            })
        }
        if (info.errorCode !== 0 && info.errorCode == config.ERRORCODE) {
            let infos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'Account (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return infos
        } else if (info.errorCode !== 0 && info.errorCode == config.DOMAINID_ERRORCODE) {
            let domainIdInfos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'DomainId (' + domainId + ') (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return domainIdInfos
        } else if (info.errorCode !== 0) {
            return util._response(info)
        }

    }
    /**
      * get account privilege
      * @param request
      * @returns {Promise<{errorDesc: *, errorCode: *}>}
      */
    async getAccountPriv (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { address, domainId } = request
        let info = await this.getInfo(address, domainId)
        if (info.errorCode === 0) {
            return util._responseData({
                address: info.result.address,
                priv: JSON.stringify(info.result.priv) || {}

            })
        }
        if (info.errorCode !== 0 && info.errorCode == config.ERRORCODE) {
            let infos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'Account (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return infos
        } else if (info.errorCode !== 0 && info.errorCode == config.DOMAINID_ERRORCODE) {
            let domainIdInfos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'DomainId (' + domainId + ') (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return domainIdInfos
        } else if (info.errorCode !== 0) {
            return util._response(info)
        }
    }
    /**
     * get account nonce
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async getNonce (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { address, domainId } = request
        let info = await this.getInfo(address, domainId)
        if (info.errorCode === 0) {
            return util._responseData({
                nonce: info.result.nonce
            })
        }
        if (info.errorCode !== 0 && info.errorCode == config.ERRORCODE) {
            let infos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'Account (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return infos
        } else if (info.errorCode !== 0 && info.errorCode == config.DOMAINID_ERRORCODE) {
            let domainIdInfos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'DomainId (' + domainId + ') (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return domainIdInfos
        } else if (info.errorCode !== 0) {
            return util._response(info)
        }

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
        let { sourceAddress, privateKey, ceilLedgerSeq, remarks, destAddress, initBalance, feeLimit, gasPrice, domainId } = request

        if (ceilLedgerSeq != null && ceilLedgerSeq != '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice != '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
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
        let query = new Query(options)
        let nonceResult = await query.getNonce(sourceAddress, domainId)
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
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq != '') {
            let blockNumber = await this.getBlockNumber(domainId)
            ceilLedgerSeq = Number(ceilLedgerSeq) + Number(blockNumber.header.blockNumber)
        }
        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: feeLimit,
            gasPrice: gasPrice,
            seqOffset: ceilLedgerSeq,
            metadata: remarks,
            domainId: domainId
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()
        if (result.results[0].error_code === 0) {
            return util._responseData({
                hash: result.results[0].hash
            })
        }
        return util._response(result.results[0])
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

        let { sourceAddress, privateKey, remarks, key, value, version, deleteFlag, feeLimit, gasPrice, ceilLedgerSeq, domainId } = request

        if (ceilLedgerSeq != null && ceilLedgerSeq != '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice != '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
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
        let query = new Query(options)
        let nonceResult = await query.getNonce(sourceAddress, domainId)
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
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq != '') {
            let blockNumber = await this.getBlockNumber(domainId)
            ceilLedgerSeq = Number(ceilLedgerSeq) + Number(blockNumber.header.blockNumber)
        }
        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: feeLimit,
            gasPrice: gasPrice,
            metadata: remarks,
            seqOffset: ceilLedgerSeq,
            domainId: domainId
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        let transactionInfo = transaction.getSignedTransactionInfo()
        console.log('BIFSubmit() : ', JSON.stringify(transactionInfo))

        const result = await transaction.submitTransaction()
        if (result.results[0].error_code === 0) {
            return util._responseData({
                hash: result.results[0].hash
            })
        }
        return util._response(result.results[0])
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

        let { sourceAddress, privateKey, txThreshold, signers, typeThresholds, feeLimit, gasPrice, ceilLedgerSeq, remarks, masterWeight, domainId } = request

        if (ceilLedgerSeq != null && ceilLedgerSeq != '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice != '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
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
        let query = new Query(options)
        let nonceResult = await query.getNonce(sourceAddress, domainId)
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
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }

        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq != '') {
            let blockNumber = await this.getBlockNumber(domainId)
            ceilLedgerSeq = Number(ceilLedgerSeq) + Number(blockNumber.header.blockNumber)
        }

        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: feeLimit,
            gasPrice: gasPrice,
            metadata: remarks,
            seqOffset: ceilLedgerSeq,
            domainId: domainId
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()
        if (result.results[0].error_code === 0) {
            return util._responseData({
                hash: result.results[0].hash
            })
        }
        return util._response(result.results[0])
    }

    /**
    * getBlockNumber
    * @param request
    * @returns {Promise<{errorDesc: *, errorCode: *}>}
    */
    async getBlockNumber (domainId) {
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getBlockNumber(domainId)
    }

}
module.exports = Account
module.exports.CRYPTO_SM2 = CRYPTO_SM2
module.exports.CRYPTO_ED25519 = CRYPTO_ED25519
