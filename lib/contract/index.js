'use strict'
const config = require('../common/constant')
const is = require('is-type-of')
const errors = require('../exception')
const Transaction = require('../transaction')
// const Account = require('../account')
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
    async getInfo (address, domainId) {
        if (!keyPair.isAddress(address) || address.trim().length === 0) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        if (domainId != null && domainId !== '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId === '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getContractBase(address, domainId)
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
     * @param request
     * @returns {Promise<boolean|{errorDesc: *, errorCode: *}>}
     */
    async checkContractAddress (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { contractAddress, domainId } = request
        if (!keyPair.isAddress(contractAddress)) {
            return util._responseError(errors.INVALID_CONTRACTADDRESS_ERROR)
        }
        if (domainId != null && domainId !== '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId === '') {
            domainId = config.INIT_ZERO
        }
        let isValid = { isValid: false }
        let info = await this.getInfo(contractAddress, domainId)
        if ((info.errorCode == 0 || info.error_code == 0) && (info.result.contract == null || info.result.contract === '')) {
            isValid = { isValid: false }
        } else if ((info.errorCode == 0 || info.error_code == 0) && (info.result.contract.payload == null || info.result.contract.payload === '')) {
            isValid = { isValid: false }
        } else if (info.errorCode == 0 || info.error_code == 0) {
            isValid = { isValid: true }
        }
        if (info.errorCode === config.CONNECTNETWORK_ERROR) {
            return info
        }
        return util._responseData(isValid)
    }

    /**
     * get Contract Info
     * @param request
     * @returns {Promise<{contract: *}|{errorDesc: *, errorCode: *}>}
     */
    async getContractInfo (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { contractAddress, domainId } = request
        if (!keyPair.isAddress(contractAddress)) {
            return util._responseError(errors.INVALID_CONTRACTADDRESS_ERROR)
        }
        let info = await this.getInfo(contractAddress, domainId)
        if (info.error_code !== 0 || info.errorCode === config.CONNECTNETWORK_ERROR) {
            return info
        }
        if (info.result.contract == null || info.result.contract === '') {
            return util._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR)
        }
        if (info.result.contract.payload == null || info.result.contract.payload === '') {
            return util._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR)
        }
        let type
        if (info.result.contract.type != null || info.result.contract.type !== '') {
            type = info.result.contract.type
        }
        if (info.result.contract.type == null || info.result.contract.type === '') {
            type = 0
        }
        let data = { type: type, contract: info.result.contract }
        return util._response(data)
    }

    /**
     * get Contract Address
     * @param request
     * @returns {Promise<{contract_address_infos: *}|{errorDesc: *, errorCode: *}>}
     */
    async getContractAddress (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { hash, domainId } = request
        if (!is.string(hash) || hash.trim().length != config.HASH_HEX_LENGTH) {
            return util._responseError(errors.INVALID_HASH_ERROR)
        }
        if (domainId != null && domainId !== '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId === '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        let info = await query.getContractAddress(hash, domainId)
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
        let { sourceAddress, privateKey, payload, initBalance, remarks, type, feeLimit, gasPrice, ceilLedgerSeq, initInput, domainId } = request
        if (!util._verifyValue(initBalance)) {
            return util._responseError(errors.INVALID_INITBALANCE_ERROR)
        }
        if (ceilLedgerSeq != null && ceilLedgerSeq !== '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit !== '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice !== '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId !== '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
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
        let operations = [createContractOperation]
        transaction.addOperation('createContract', operations)
        let query = new Query(options)
        let nonceResult = await query.getNonce(sourceAddress, domainId)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        if (feeLimit == null || feeLimit === '') {
            feeLimit = config.feeLimit
        }
        if (gasPrice == null || gasPrice === '') {
            gasPrice = config.gasPrice
        }
        if (domainId == null || domainId === '') {
            domainId = config.INIT_ZERO
        }
        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq !== '') {
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
     * contract Query
     * @param request
     * @returns {Promise<{header: *}|{errorDesc: *, errorCode: *}>}
     */
    async contractQuery (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { sourceAddress, contractAddress, input, feeLimit, gasPrice, domainId } = request
        if (sourceAddress != null && sourceAddress !== '' && !keyPair.isAddress(sourceAddress)) {
            return util._responseError(errors.INVALID_SOURCEADDRESS_ERROR)
        }
        if (!keyPair.isAddress(contractAddress)) {
            return util._responseError(errors.INVALID_CONTRACTADDRESS_ERROR)
        }
        if (sourceAddress === contractAddress) {
            return util._responseError(errors.SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR)
        }
        if (feeLimit != null && feeLimit !== '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice !== '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId !== '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        // 参数校验
        let operation = new Operation()
        let data = operation.contractQueryOperation(request)
        if (data.errorCode !== 0) {
            return data
        }
        if (feeLimit == null || feeLimit === '') {
            feeLimit = config.feeLimit
        }
        if (gasPrice == null || gasPrice === '') {
            gasPrice = config.gasPrice
        }
        if (domainId == null || domainId === '') {
            domainId = config.INIT_ZERO
        }
        let contractQueryOperation = {
            source_address: sourceAddress,
            contract_address: contractAddress,
            opt_type: config.contract_query_type,
            input: input,
            gas_price: gasPrice,
            fee_limit: feeLimit,
            domain_id: domainId
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
        let { sourceAddress, privateKey, feeLimit, gasPrice, contractAddress, remarks, amount, ceilLedgerSeq, input, domainId } = request

        if (ceilLedgerSeq != null && ceilLedgerSeq !== '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit !== '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice !== '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId !== '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
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

        // 调用合约账户接口判断是否为合约账户
        let contract = new Contract(options)
        let paramContractObject = { contractAddress, domainId }
        let isContractAddress = await contract.checkContractAddress(paramContractObject)
        if (isContractAddress.result == false) {
            return util._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR)
        }

        let contractInvoke = {
            to: contractAddress,
            amount: amount,
            input: input
        }

        let operations = [contractInvoke]
        transaction.addOperation('payCoin', operations)
        let query = new Query(options)
        let nonceResult = await query.getNonce(sourceAddress, domainId)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }

        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)
        if (feeLimit == null || feeLimit === '') {
            feeLimit = config.feeLimit
        }
        if (gasPrice == null || gasPrice === '') {
            gasPrice = config.gasPrice
        }
        if (domainId == null || domainId === '') {
            domainId = config.INIT_ZERO
        }
        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq !== '') {
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

    /**
        * contract Invoke
        * @param request
        * @returns {Promise<{header: *}|{errorDesc: *, errorCode: *}>}
        */
    async batchContractInvoke (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { senderAddress, privateKey, feeLimit, gasPrice, remarks, ceilLedgerSeq, domainId, operations } = request

        if (ceilLedgerSeq != null && ceilLedgerSeq !== '' && !util._isAvailableValue(ceilLedgerSeq)) {
            return util._responseError(errors.INVALID_CEILLEDGERSEQ_ERROR)
        }
        if (feeLimit != null && feeLimit !== '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice != null && gasPrice !== '' && !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId !== '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (operations == null || operations === '' || operations.length == 0) {
            return util._responseError(errors.OPERATIONS_EMPTY_ERROR)
        }
        // 参数校验
        let operation = new Operation()
        let data = operation.contractInvokeRequestOperation(request)
        if (data.errorCode !== 0) {
            return data
        }

        let options = {
            host: this.host
        }
        let transaction = new Transaction(options)

        if (!keyPair.isAddress(request.senderAddress)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }

        // 参数验证及合约账号校验
        let operationsArr = []
        let map = new Map()
        for (var key in operations) {
            var contractAddress = operations[key].contractAddress
            if (map.has(contractAddress)) {
                map.set(contractAddress, operations[key])
            } else {
                let tmpList = []
                tmpList.push(operations[key])
                if (!keyPair.isAddress(contractAddress)) {
                    return util._responseError(errors.INVALID_ADDRESS_ERROR)
                }
                // 调用合约账户接口判断是否为合约账户
                let contract = new Contract(options)
                let paramContractObject = { contractAddress, domainId }
                let isContractAddress = await contract.checkContractAddress(paramContractObject)
                if (isContractAddress.result == false) {
                    return util._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR)
                }
                map.set(contractAddress, tmpList)
            }
            let amount = operations[key].amount
            if (amount == null || amount === '' || !util._isAvailableValue(amount)) {
                return util._responseError(errors.INVALID_AMOUNT_ERROR)
            }
            let contractInvokeParam = {
                to: contractAddress,
                amount: amount,
                input: operations[key].input
            }
            operationsArr.push(contractInvokeParam)
        }

        transaction.addOperation('payCoin', operationsArr)

        let query = new Query(options)
        let nonceResult = await query.getNonce(senderAddress, domainId)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }

        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)
        if (feeLimit == null || feeLimit === '') {
            feeLimit = config.feeLimit
        }
        if (gasPrice == null || gasPrice === '') {
            gasPrice = config.gasPrice
        }
        if (domainId == null || domainId === '') {
            domainId = config.INIT_ZERO
        }
        // 获取blockNumber
        if (ceilLedgerSeq != null && ceilLedgerSeq !== '') {
            let blockNumber = await this.getBlockNumber(domainId)
            ceilLedgerSeq = Number(ceilLedgerSeq) + Number(blockNumber.header.blockNumber)
        }
        let tranactionParameter = {
            sourceAddress: senderAddress,
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

}
module.exports = Contract
