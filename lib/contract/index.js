'use strict'
const config = require('../common/constant')
const is = require('is-type-of')
const errors = require('../exception')
const Transaction = require('../transaction')
const Account = require('../account')
const BigNumber = require('bignumber.js')
const keyPair = require('../keypair')
const Query = require('../query')
const Operation = require('../validate')
const unit = require('../common/util')

class Contract {
    constructor(options = {}) {
        this.host = options.host
    }
    /**
     * Get contract information
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
        return query.getContractBase(address)
    };

    /**
     * call Contract
     * @param address
     * @returns {Promise<*>}
     */
    async callContract (paramsJson) {
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.callContract(paramsJson)
    };

    /**
     * check Contract Address
     * @param address
     * @returns {Promise<boolean|{errorDesc: *, errorCode: *}>}
     */
    async checkContractAddress (address) {
        if (!is.string(address) || address.trim().length === 0) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.error_code === 0) {
            return unit._responseData(true)
        }
        if (info.errorCode === 11007) {
            return info
        }
        return false
    }

    /**
     * get Contract Info
     * @param address
     * @returns {Promise<{contract: *}|{errorDesc: *, errorCode: *}>}
     */
    async getContractInfo (address) {
        if (!is.string(address) || address.trim().length === 0) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.error_code !== 0 || info.errorCode === 11007) {
            return info
        }
        let data = { contract: info.result.contract }
        return data
    }

    /**
     * get Contract Address
     * @param hash
     * @returns {Promise<{contract_address_infos: *}|{errorDesc: *, errorCode: *}>}
     */
    async getContractAddress (hash) {
        if (!is.string(hash) || hash.trim().length === 0) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        let info = await query.getContractAddress(hash)
        if (info.error_code !== 0 || info.errorCode === 11007) {
            return info
        }
        let contractData = {
            contract_address: info.contract_address_infos[0].contract_address,
            operation_index: info.contract_address_infos[0].operation_index
        }

        let data = { contract_address_infos: contractData }
        return data
    }

    /**
     * create Contract
     * @param request
     * @returns {Promise<{errorDesc: *, errorCode: *}>}
     */
    async createContract (request = {}) {
        let { sourceAddress, privateKey, payload, initBalance, remarks, type, feeLimit, ceilLedgerSeq, initInput } = request

        // 参数校验
        let operation = new Operation()
        let data = operation.contractCreateOperation(request)

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
        let createContractOperation = {
            initBalance: initBalance,
            payload: payload,
            initInput: initInput,
            type: type
        }

        transaction.addOperation('createContract', createContractOperation)
        let query = new Query(options)

        let nonceResult = await query.getNonce(sourceAddress)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: feeLimit,
            gasPrice: config.gasPrice,
            seqOffset: ceilLedgerSeq,
            metadata: remarks
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()
        if (result.results[0].error_code === 0) {
            return unit._responseData({
                hash: result.results[0].hash
            })
        }
        return result.results
    }

    /**
     * contract Query
     * @param request
     * @returns {Promise<{header: *}|{errorDesc: *, errorCode: *}>}
     */
    async contractQuery (request = {}) {
        // 参数校验
        let operation = new Operation()
        let data = operation.contractQueryOperation(request)

        if (data.errorCode !== 0) {
            return data
        }
        let contractQueryOperation = {
            source_address: request.sourceAddress,
            contract_address: request.contractAddress,
            opt_type: config.contract_query_type,
            input: request.input,
            gas_price: config.gasPrice,
            fee_limit: config.feeLimit
        }
        let info = await this.callContract(contractQueryOperation)
        if (info.error_code !== 0 || info.errorCode === 11007) {
            return info
        }
        let result = { query_rets: info.result.query_rets }
        return result

    }
    /**
     * contract Invoke
     * @param request
     * @returns {Promise<{header: *}|{errorDesc: *, errorCode: *}>}
     */
    async contractInvoke (request = {}) {
        let { sourceAddress, privateKey, feeLimit, contractAddress, remarks, amount, ceilLedgerSeq, input } = request
        // 参数校验
        let operation = new Operation()
        let data = operation.contractInvokeOperation(request)
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
        let contractInvoke = {
            to: contractAddress,
            amount: amount,
            input: input
        }

        transaction.addOperation('payCoin', contractInvoke)
        let account = new Account(options)
        let nonceResult = await account.getNonce(sourceAddress)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }

        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)
        if (feeLimit === '') {
            feeLimit = config.feeLimit
        }
        let tranactionParameter = {
            sourceAddress: sourceAddress,
            nonce: nonce,
            feeLimit: feeLimit,
            gasPrice: config.gasPrice,
            metadata: remarks,
            seqOffset: ceilLedgerSeq
        }
        transaction.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        transaction.signTransaction(privateKeyArray)
        const result = await transaction.submitTransaction()

        return result

    }
}
module.exports = Contract
