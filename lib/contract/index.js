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
const util = require('../common/util')

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
        if (!keyPair.isAddress(address) || address.trim().length === 0) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
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
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_CONTRACTADDRESS_ERROR)
        }
        let isValid = { isValid: false }
        let info = await this.getInfo(address)
        if (info.error_code == 0) {
            isValid = { isValid: true }
        }
        if (info.errorCode === config.CONNECTNETWORK_ERROR) {
            return info
        }
        return util._responseData(isValid)
    }

    /**
     * get Contract Info
     * @param address
     * @returns {Promise<{contract: *}|{errorDesc: *, errorCode: *}>}
     */
    async getContractInfo (address) {
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_CONTRACTADDRESS_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.error_code !== 0 || info.errorCode === config.CONNECTNETWORK_ERROR) {
            return info
        }
        let type
        if (info.result.contract.type != null || info.result.contract.type != '') {
            type = info.result.contract.type
        }
        if (info.result.contract.type == null || info.result.contract.type == '') {
            type = 0
        }
        let data = { type: type, contract: info.result.contract }
        return data
    }

    /**
     * get Contract Address
     * @param hash
     * @returns {Promise<{contract_address_infos: *}|{errorDesc: *, errorCode: *}>}
     */
    async getContractAddress (hash) {
        if (!is.string(hash) || hash.trim().length != config.HASH_HEX_LENGTH) {
            return util._responseError(errors.INVALID_HASH_ERROR)
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        let info = await query.getContractAddress(hash)
        if (info.error_code !== 0 || info.errorCode === config.CONNECTNETWORK_ERROR) {
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
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { sourceAddress, privateKey, payload, initBalance, remarks, type, feeLimit, gasPrice, ceilLedgerSeq, initInput } = request
        if (!util._verifyValue(initBalance)) {
            return util._responseError(errors.INVALID_INITBALANCE_ERROR)
        }
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
        let data = operation.contractCreateOperation(request)

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
        if (result.results[0].error_code === 0) {
            return util._responseData({
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
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { sourceAddress, contractAddress, input, feeLimit, gasPrice } = request
        if (sourceAddress != null && sourceAddress != '' && !keyPair.isAddress(sourceAddress)) {
            return util._responseError(errors.INVALID_SOURCEADDRESS_ERROR)
        }
        if (!keyPair.isAddress(contractAddress)) {
            return util._responseError(errors.INVALID_CONTRACTADDRESS_ERROR)
        }
        if (sourceAddress === contractAddress) {
            return util._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR)
        }
        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice != '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        // 参数校验
        let operation = new Operation()
        let data = operation.contractQueryOperation(request)
        if (data.errorCode !== 0) {
            return data
        }
        if (feeLimit == null || feeLimit == '') {
            feeLimit = config.feeLimit
        }
        if (gasPrice == null || gasPrice == '') {
            gasPrice = config.gasPrice
        }
        let contractQueryOperation = {
            source_address: sourceAddress,
            contract_address: contractAddress,
            opt_type: config.contract_query_type,
            input: input,
            gas_price: gasPrice,
            fee_limit: feeLimit
        }
        let info = await this.callContract(contractQueryOperation)
        if (info.error_code !== 0 || info.errorCode === config.CONNECTNETWORK_ERROR) {
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
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { sourceAddress, privateKey, feeLimit, gasPrice, contractAddress, remarks, amount, ceilLedgerSeq, input } = request

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
        let data = operation.contractInvokeOperation(request)
        if (data.errorCode !== 0) {
            return data
        }

        let options = {
            host: this.host
        }
        let transaction = new Transaction(options)

        if (!keyPair.isAddress(request.sourceAddress)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
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

        // 调用合约账户接口判断是否为合约账户
        let contract = new Contract(options)
        let isContractAddress = await contract.checkContractAddress(contractAddress)
        if (isContractAddress.result == false) {
            return util._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR)
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
module.exports = Contract
