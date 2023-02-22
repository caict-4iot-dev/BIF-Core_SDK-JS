'use strict'
const rp = require('request-promise')
const signer = require('../signer')
const long = require('long')
const protoChain = require('../protobuf/chain_pb')
const operations = require('./operations')
const Operation = require('../validate')
const crypto = require('crypto')
const keypair = require('../keypair')
const Query = require('../query')
const BigNumber = require('bignumber.js')
const errors = require('../exception')
const is = require('is-type-of')
const config = require('../common/constant')
const util = require('../common/util')
const Operaction = require('../operation')
const OperactionType = new Operaction()
const ContractInvokeOperation = require('../operation/contractInvokeOperation')

class Transaction {
    constructor(options = {}) {
        this.host = options.host
        this.operations = []
        this.blob = ''
        this.hash = ''
        this.signatures = []
    }

    /**
     * Add operation
     *
     * @param {String} type
     * @param {Object} options
     */
    addOperation (type, option = {}) {
        let param = option
        for (var i = 0; i < param.length; i++) {
            const option = param[i]
            switch (type) {
                case 'payCoin':
                    this.operations.push(operations.payCoin(option))
                    break
                case 'setMetadata':
                    this.operations.push(operations.setMetadata(option))
                    break
                case 'activateAccount':
                    this.operations.push(operations.activateAccount(option))
                    break
                case 'setPrivilegeOperation':
                    this.operations.push(operations.accountSetPrivilegeOperation(option))
                    break
                case 'createContract':
                    this.operations.push(operations.createContract(option))
                    break
                default:
                    throw new Error('unknown operation')
            }
        }
    }

    /**
     * gasSend
     * @param request
     * @returns {Promise<{header: *}|{errorDesc: *, errorCode: *}>}
     */
    async gasSend (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { sourceAddress, privateKey, destAddress, remarks, amount, ceilLedgerSeq, gasPrice, feeLimit, domainId } = request

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
        let data = operation.SendOperation(request)
        if (data.errorCode !== 0) {
            return data
        }
        let options = {
            host: this.host
        }
        if (!keypair.isAddress(sourceAddress)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        };
        let gasSend = {
            to: destAddress,
            amount: amount
        }
        var transaction = new Transaction(options)

        let operations = [gasSend]
        transaction.addOperation('payCoin', operations)

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
        // console.log('transBlob:', this.blob)
        if (result.results[0].error_code === 0) {
            return util._responseData({
                hash: result.results[0].hash
            })
        }
        return util._response(result.results[0])
    }

    async getTransactionInfo (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { hash, domainId } = request
        if (!is.string(hash) || hash.trim().length != config.HASH_HEX_LENGTH) {
            return util._responseError(errors.INVALID_HASH_ERROR)
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
        let info = await query.getTransactionByHash(hash, domainId)
        if (info.error_code !== 0) {
            return info
        }
        return util._responseData({
            total_count: info.result.total_count,
            transactions: info.result.transactions || {}
        })
    }

    async evaluateFee (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { sourceAddress, privateKey, gasPrice, feeLimit, operations, domainId } = request

        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice == null || gasPrice == '' || !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        if (!is.object(operations) || operations == null || operations == '') {
            return util._responseError(errors.OPERATIONS_EMPTY_ERROR)
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        // nonce查询
        let nonceResult = await query.getNonce(sourceAddress, domainId)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)
        let actionType = Object.getOwnPropertyDescriptor(request.operations, 'operationType').value
        // 封装请求
        let privateKeyArray = [privateKey]
        let operation = [operations]
        let transaction = new Transaction(options)
        // 构建对象
        let itemOperations = await transaction.buildOperation(actionType, operation)
        let item = {
            items: [
                {
                    private_keys: privateKeyArray,
                    transaction_json: {
                        fee_limit: feeLimit,
                        gas_price: gasPrice,
                        source_address: sourceAddress,
                        nonce: nonce,
                        operations: [itemOperations],
                        domainId: domainId
                    },
                    signature_number: 1
                }
            ]
        }

        let info = await query.evaluateFee(item)
        if (info.error_code !== 0) {
            return info
        }
        var hop = info.result.txs[0].transaction_env.transaction
        return util._responseData({
            feeLimit: Object.prototype.hasOwnProperty.call(hop, 'fee_limit') ? hop.fee_limit : 0,
            gasPrice: Object.prototype.hasOwnProperty.call(hop, 'gas_price') ? hop.gas_price : 0
        })
    }

    async batchEvaluateFee (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { sourceAddress, privateKey, gasPrice, feeLimit, operations, domainId } = request

        if (feeLimit != null && feeLimit != '' && !util._isAvailableValue(feeLimit)) {
            return util._responseError(errors.INVALID_FEELIMIT_ERROR)
        }
        if (gasPrice == null || gasPrice == '' || !util._isAvailableValue(gasPrice)) {
            return util._responseError(errors.INVALID_GASPRICE_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        if (operations == null || operations == '' || operations.length == 0) {
            return util._responseError(errors.OPERATIONS_EMPTY_ERROR)
        }

        let options = {
            host: this.host
        }
        let transaction = new Transaction(options)
        let query = new Query(options)
        // nonce查询
        let nonceResult = await query.getNonce(sourceAddress, domainId)
        if (nonceResult.errorCode !== 0) {
            return nonceResult
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)

        var operationNumber = []
        for (var i = 0; i < request.operations.length; i++) {
            let contractInvokeOperation = new ContractInvokeOperation()
            contractInvokeOperation.setContractAddress(operations[i].contractAddress)
            contractInvokeOperation.setAmount(operations[i].amount)
            contractInvokeOperation.setInput(operations[i].input)
            contractInvokeOperation.setOperationType(contractInvokeOperation.getOperationType())
            contractInvokeOperation.setActionType(contractInvokeOperation.getActionType())
            var actionType = Object.getOwnPropertyDescriptor(contractInvokeOperation, 'operationType').value
            operationNumber.push(contractInvokeOperation)
        }

        // 封装请求
        let privateKeyArray = [privateKey]
        // 构建对象
        let itemOperations = await transaction.buildOperation(actionType, operationNumber)
        let item = {
            items: [
                {
                    private_keys: privateKeyArray,
                    transaction_json: {
                        fee_limit: feeLimit,
                        gas_price: gasPrice,
                        source_address: sourceAddress,
                        nonce: nonce,
                        operations: [itemOperations],
                        domainId: domainId
                    },
                    signature_number: 1
                }
            ]
        }

        let info = await query.evaluateFee(item)
        if (info.error_code !== 0) {
            return info
        }
        var hop = info.result.txs[0].transaction_env.transaction
        return util._responseData({
            feeLimit: Object.prototype.hasOwnProperty.call(hop, 'fee_limit') ? hop.fee_limit : 0,
            gasPrice: Object.prototype.hasOwnProperty.call(hop, 'gas_price') ? hop.gas_price : 0
        })
    }

    async buildOperation (type, option = {}) {
        let param = option
        for (var i = 0; i < param.length; i++) {
            let option = param[i]
            let operation, item
            switch (type) {
                case 'ACCOUNT_ACTIVATE': {
                    operation = OperactionType.accountCreateOperation
                    operation = option
                    item = {
                        create_account: {
                            dest_address: operation.getDestAddress(),
                            init_balance: operation.getInitBalance(),
                            priv: {
                                master_weight: 1,
                                thresholds: {
                                    tx_threshold: 1
                                }
                            }
                        },
                        type: operation.getActionType()
                    }
                    break
                }
                case 'ACCOUNT_SET_METADATA': {
                    operation = OperactionType.accountSetMetadataOperation
                    operation = option
                    item = {
                        set_metadata: {
                            key: operation.getKey(),
                            value: operation.getValue(),
                            version: operation.getVersion()
                        },
                        type: operation.getActionType()
                    }
                    break
                }
                case 'ACCOUNT_SET_PRIVILEGE': {
                    operation = OperactionType.accountSetPrivilegeOperation
                    operation = option
                    item = {
                        set_privilege: {
                            master_weight: operation.getMasterWeight(),
                            signers: operation.getSigners(),
                            tx_threshold: operation.getTxThreshold(),
                            type_thresholds: operation.getTypeThresholds()
                        },
                        type: operation.getActionType()
                    }
                    break
                }
                case 'GAS_SEND': {
                    operation = OperactionType.gasSendOperation
                    operation = option
                    item = {
                        pay_coin: {
                            dest_address: operation.getDestAddress(),
                            amount: operation.getAmount()
                        },
                        type: operation.getActionType()
                    }
                    break
                }
                case 'CONTRACT_CREATE': {
                    operation = OperactionType.contractCreateOperation
                    operation = option
                    item = {
                        create_account: {
                            contract: {
                                payload: operation.getPayload()
                            },
                            init_balance: operation.getInitBalance(),
                            init_input: operation.getInitInput(),
                            priv: {
                                master_weight: 0,
                                thresholds: {
                                    tx_threshold: 1
                                }
                            }
                        },
                        type: operation.getActionType()
                    }
                    break
                }
                case 'CONTRACT_INVOKE': {
                    operation = OperactionType.contractInvokeOperation
                    operation = option
                    item = {
                        pay_coin: {
                            dest_address: operation.getContractAddress(),
                            amount: operation.getAmount(),
                            input: operation.getInput()
                        },
                        type: operation.getActionType()
                    }
                    break
                }
                default: {
                    throw new Error('unknown operation')
                }
            }
            return item
        }
    }
    /**
     * Build transaction
     *
     * @param {Object} args
     * @param {String} args.sourceAddress
     * @param {String} args.nonce
     * @param {String} [args.feeLimit]
     * @param {String} [args.gasPrice]
     * @param {String} [args.seq]
     * @param {String} [args.metadata]
     * @returns {string}
     */
    buildTransaction (args = {}) {
        if (this.operations.length === 0) {
            throw new Error('must add operation first')
        }
        const {
            sourceAddress,
            nonce,
            feeLimit,
            gasPrice,
            seqOffset,
            metadata,
            domainId
        } = args
        const tx = new protoChain.Transaction()
        tx.setSourceAddress(sourceAddress)
        if (nonce !== 0 && nonce !== '0') {
            tx.setNonce(long.fromValue(nonce))
        }
        if (feeLimit !== 0 && feeLimit !== '0') {
            tx.setFeeLimit(long.fromValue(feeLimit))
        }
        if (gasPrice !== 0 && gasPrice !== '0') {
            tx.setGasPrice(long.fromValue(gasPrice))
        }
        if (seqOffset) {
            tx.setCeilLedgerSeq(long.fromValue(seqOffset))
        }
        if (metadata) {
            tx.setMetadata(Uint8Array.from(Buffer.from(metadata, 'utf8')))
        }
        if (domainId) {
            tx.setDomainId(Number(domainId))
        }
        tx.setOperationsList(this.operations)

        const blob = Buffer.from(tx.serializeBinary()).toString('hex')

        this.blob = blob
        this.hash = crypto.createHash('sha256')
            .update(
                new Buffer(blob, 'hex'))
            .digest('hex')
    }

    /**
     * Sign transaction
     *
     * @param {Array} privateKeys
     */
    signTransaction (privateKeys) {
        this.signatures = this.signTransSerialization(privateKeys, this.blob)
    }
    signTransSerialization (privateKeys, transBlob) {
        if (!Array.isArray(privateKeys)) {
            throw new Error('privateKeys must be an array')
        }

        if (transBlob.length === 0) {
            throw new Error('serialization is required')
        }

        const signatures = []
        privateKeys.forEach(privateKey => {
            if (!keypair.isPrivateKey(privateKey)) {
                throw new Error(`'${privateKey}' is not privateKey`)
            }
            signatures.push({
                sign_data: signer.sign(transBlob, privateKey),
                public_key: keypair.getEncPublicKey(privateKey)
            })
        })
        return signatures
    }

    /**
     * Get signed transaction information
     *
     * @returns {Object}
     * @public
     */
    getSignedTransactionInfo () {
        if (this.blob.length === 0) {
            throw new Error('serialization is required')
        }

        if (this.signatures.length === 0) {
            throw new Error('signatures is required')
        }

        const blob = this.blob
        const signatures = this.signatures
        let postData = {
            items: [{
                transaction_blob: blob,
                signatures: signatures
            }]
        }
        return postData
    }

    async submitTransaction () {
        return this.submitTrans(this.blob, this.signatures)
    }

    async submitTrans (txBlob, signatures) {
        const blob = txBlob
        let postData = {
            items: [{
                transaction_blob: blob,
                signatures: signatures
            }]
        }
        const options = {
            method: 'POST',
            uri: `${this.host}/submitTransaction`,
            body: postData,
            json: true
        }
        return rp(options)
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

    async getTxCacheSize (domainId) {
        if (typeof (domainId) == 'undefined' || domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getTxCacheSize(domainId)
    }

    async getTxCacheData (request = {}) {
        let { domainId, hash } = request
        if (typeof (domainId) == 'undefined' || domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (typeof (hash) != 'undefined' && hash != null && hash != '') {
            if (!is.string(hash) || hash.trim().length != config.HASH_HEX_LENGTH) {
                return util._responseError(errors.INVALID_HASH_ERROR)
            }
        } else {
            hash = ''
        }
        let options = {
            host: this.host
        }
        let query = new Query(options)
        return query.getTransactionCache(domainId, hash)
    }

    async parseBlob (blob) {
        if (blob == null || blob == '' || blob.trim().length === 0) {
            return util._responseError(errors.INVALID_SERIALIZATION_ERROR)
        }
        try {
            const buffer = Buffer.from(blob, 'hex')
            const tx = protoChain.Transaction.deserializeBinary(buffer)
            const buf = Buffer.from(tx.getMetadata_asU8(), 'hex')
            const meta = buf.toString('utf8')
            var operationsListData = tx.toObject().operationsList
            var newoperationsListData = []
            operationsListData.map((item, index) => {
                let operData
                let newValue = ''
                let keyValue = ''
                switch (item.type) {
                    case 0:
                        newValue = 'UNKNOWN'
                        break
                    case 1:
                        newValue = 'CREATE_ACCOUNT'
                        keyValue = 'createAccount'
                        operData = item.createAccount
                        break
                    case 4:
                        newValue = 'SET_METADATA'
                        keyValue = 'setMetadata'
                        operData = item.setMetadata
                        break
                    case 7:
                        newValue = 'PAY_COIN'
                        keyValue = 'payCoin'
                        operData = {
                            destAddress: item.payCoin.destAddress,
                            amount: item.payCoin.amount,
                            input: item.payCoin.input
                        }
                        break
                    case 9:
                        newValue = 'SET_PRIVILEGE'
                        keyValue = 'setPrivilege'
                        operData = item.setPrivilege
                        break
                    default:
                        throw new Error('unknown type')
                }
                newoperationsListData.push({
                    type: newValue,
                    [keyValue]: operData
                })
            })
            if (tx.toObject().domainId != 0) {
                return util._response({
                    source_address: tx.toObject().sourceAddress,
                    fee_limit: tx.toObject().feeLimit,
                    gas_price: tx.toObject().gasPrice,
                    nonce: tx.toObject().nonce,
                    domain_id: tx.toObject().domainId,
                    remarks: meta,
                    operations: newoperationsListData
                })
            } else {

                return util._response({
                    source_address: tx.toObject().sourceAddress,
                    fee_limit: tx.toObject().feeLimit,
                    gas_price: tx.toObject().gasPrice,
                    nonce: tx.toObject().nonce,
                    remarks: meta,
                    operations: newoperationsListData
                })
            }
        } catch (e) {
            return util._responseError(errors.INVALID_SERIALIZATION_ERROR)
        }

    }
}

module.exports = Transaction
