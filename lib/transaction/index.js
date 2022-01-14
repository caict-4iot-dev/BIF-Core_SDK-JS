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
const unit = require('../common/util')
const Operaction = require('../operation')
const OperactionType = new Operaction()
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
            case 'privateContractCreate':
                this.operations.push(operations.privateContractCreate(option))
                break
            case 'privateContractCall':
                this.operations.push(operations.privateContractCall(option))
                break
            default:
                throw new Error('unknown operation')
        }
    }

    /**
     * gasSend
     * @param request
     * @returns {Promise<{header: *}|{errorDesc: *, errorCode: *}>}
     */
    async gasSend (request = {}) {
        let { sourceAddress, privateKey, destAddress, remarks, amount, ceilLedgerSeq } = request
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
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        };
        let gasSend = {
            to: destAddress,
            amount: amount
        }
        this.addOperation('payCoin', gasSend)

        let query = new Query(options)
        let nonceResult = await query.getNonce(sourceAddress)
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
            metadata: remarks,
            seqOffset: ceilLedgerSeq
        }
        this.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        this.signTransaction(privateKeyArray)
        const result = await this.submitTransaction()
        if (result.results[0].error_code === 0) {
            return unit._responseData({
                hash: result.results[0].hash
            })
        }
        return result.results
    }

    /**
     * private Contract Create
     * @param request
     * @returns {Promise<{header: *}|{errorDesc: *, errorCode: *}>}
     */
    async privateContractCreate (request = {}) {
        let { sourceAddress, privateKey, type, from, to, remarks, payload, ceilLedgerSeq } = request
        // 参数校验
        let operation = new Operation()
        let data = operation.PrivateContractCreateOperation(request)
        if (data.errorCode !== 0) {
            return data
        }

        let options = {
            host: this.host
        }
        if (!keypair.isAddress(sourceAddress)) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        };

        let query = new Query(options)
        let paramsJson = {
            payload: payload,
            from: from,
            to: to
        }
        let info = await query.priSend(paramsJson)
        if (info.error_code !== 0) {
            return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let payloadcode = info.pri_tx_hash

        if (!is.string(payloadcode) || payloadcode.trim().length === 0) {
            return unit._responseError(errors.INVALID_PRITX_HASH_ERROR)
        }
        let privateContractCreate = {
            type: type,
            payload: payloadcode
        }
        this.addOperation('privateContractCreate', privateContractCreate)

        // let query = new Query(options)
        let nonceResult = await query.getNonce(sourceAddress)
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
            metadata: remarks,
            seqOffset: ceilLedgerSeq
        }
        this.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        this.signTransaction(privateKeyArray)
        const result = await this.submitTransaction()
        if (result.results[0].error_code === 0) {
            return unit._responseData({
                hash: result.results[0].hash
            })
        }
        return result.results
    }

    /**
     * private Contract Call
     * @param request
     * @returns {Promise<{header: *}|{errorDesc: *, errorCode: *}>}
     */
    async privateContractCall (request = {}) {
        let { sourceAddress, privateKey, from, to, remarks, destAddress, input, ceilLedgerSeq } = request

        // 参数校验
        let operation = new Operation()
        let data = operation.PrivateContractCallOperation(request)
        if (data.errorCode !== 0) {
            return data
        }

        let options = {
            host: this.host
        }
        if (!keypair.isAddress(sourceAddress)) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        };
        let query = new Query(options)
        let paramsJson = {
            payload: input,
            from: from,
            to: to
        }
        let info = await query.priSend(paramsJson)
        let payloadcode = info.pri_tx_hash

        let privateContractCall = {
            destAddress: destAddress,
            input: payloadcode
        }
        this.addOperation('privateContractCall', privateContractCall)

        // let query = new Query(options)
        let nonceResult = await query.getNonce(sourceAddress)
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
            metadata: remarks,
            seqOffset: ceilLedgerSeq
        }
        this.buildTransaction(tranactionParameter)
        let privateKeyArray = [privateKey]
        this.signTransaction(privateKeyArray)
        const result = await this.submitTransaction()
        if (result.results[0].error_code === 0) {
            return unit._responseData({
                hash: result.results[0].hash
            })
        }
        return result.results
    }
    async getTransactionInfo (hash) {
        if (!is.string(hash) || hash.trim().length === 0) {
            return unit._responseError(errors.REQUEST_NULL_ERROR)
        }
        let options = {
            host: this.host
        }

        let query = new Query(options)
        let info = await query.getTransactionByHash(hash)
        if (info.error_code !== 0) {
            return info
        }
        return unit._responseData({
            total_count: info.result.total_count,
            transactions: info.result.transactions || {}
        })
    }

    async evaluateFee (request = {}) {
        let options = {
            host: this.host
        }
        let query = new Query(options)
        // nonce查询
        let nonceResult = await query.getNonce(request.sourceAddress)
        if (nonceResult.errorCode !== 0) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let nonce = nonceResult.result.nonce
        nonce = new BigNumber(nonce).plus(1).toString(10)
        let actionType = Object.getOwnPropertyDescriptor(request.operations, 'operationType').value
        // 封装请求
        let privateKeyArray = [request.privateKey]
        // 构建对象
        let itemOperations = await this.buildOperation(actionType, request.operations)
        let item = {
            items: [
                {
                    private_keys: privateKeyArray,
                    transaction_json: {
                        fee_limit: config.feeLimit,
                        gas_price: config.gasPrice,
                        source_address: request.sourceAddress,
                        nonce: nonce,
                        operations: [itemOperations]
                    },
                    signature_number: 1
                }
            ]
        }

        let info = await query.evaluateFee(item)
        if (info.error_code !== 0) {
            return info
        }
        return unit._responseData({
            feeLimit: info.result.txs[0].transaction_env.transaction.fee_limit,
            gasPrice: info.result.txs[0].transaction_env.transaction.gas_price
        })
    }

    async buildOperation (type, option = {}) {
        let options = {
            host: this.host
        }
        let query = new Query(options)
        let operation
        let item
        switch (type) {
            case 'ACCOUNT_ACTIVATE': {
                 operation = OperactionType.accountactivateoperation
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
                        input: operation.getInitInput
                    },
                    type: operation.getActionType()
                }
                break
            }
            case 'PRIVATE_CONTRACT_CREATE': {
                operation = OperactionType.privateContractCreateOperation
                operation = option
                let paramsJson = {
                    payload: operation.getPayload(),
                    from: operation.getFrom(),
                    to: operation.getTo()
                }
                let priSendInfo = await query.priSend(paramsJson)
                if (priSendInfo.error_code !== 0) {
                    return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
                }
                let payloadcode = priSendInfo.pri_tx_hash
                item = {
                    create_private_contract: {
                        contract: {
                            payload: payloadcode
                        },
                        init_input: operation.getInitInput()
                    },
                    type: operation.getActionType()
                }
                break
            }
            case 'PRIVATE_CONTRACT_CALL': {
                operation = OperactionType.privateContractCallOperation
                operation = option
                let params = {
                    payload: operation.getInput(),
                    from: operation.getFrom(),
                    to: operation.getTo()
                }
                let priInfo = await query.priSend(params)
                if (priInfo.error_code !== 0) {
                    return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
                }
                let payload = priInfo.pri_tx_hash
                item = {
                    call_private_contract: {
                        dest_address: operation.getDestAddress(),
                        input: payload,
                        init_input: operation.getInput
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
            metadata
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

}

module.exports = Transaction
