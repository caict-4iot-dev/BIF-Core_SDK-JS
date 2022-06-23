'use strict'
const long = require('long')
const protoChain = require('../protobuf/chain_pb')
const is = require('is-type-of')
const keypair = require('../keypair')
const errors = require('../exception')

function payCoin (args = {}) {
    const {
        from, to, amount, input, metadata
    } = args

    const payCoin = new protoChain.OperationPayCoin()
    payCoin.setDestAddress(to)
    if (amount !== 0 && amount !== '0') {
        payCoin.setAmount(long.fromValue(amount))
    }
    if (input) {
        payCoin.setInput(input)
    }
    let operation = new protoChain.Operation()
    operation.setType(protoChain.Operation.Type.PAY_COIN)
    operation.setPayCoin(payCoin)
    if (metadata) {
        operation.setMetadata(Uint8Array.from(Buffer.from(metadata, 'utf8')))
    }
    if (from) {
        operation.setSourceAddress(from)
    }
    return operation
}

function activateAccount (args = {}) {
    const {
        to, initBalance
    } = args

    const defaultTxThreshold = 1
    const defaultMasterWeight = 1

    const threshold = new protoChain.AccountThreshold()
    threshold.setTxThreshold(defaultTxThreshold)

    const privilege = new protoChain.AccountPrivilege()
    privilege.setThresholds(threshold)
    privilege.setMasterWeight(defaultMasterWeight)

    const createAccount = new protoChain.OperationCreateAccount()
    createAccount.setDestAddress(to)
    createAccount.setInitBalance(long.fromValue(initBalance))
    createAccount.setPriv(privilege)

    const operation = new protoChain.Operation()
    operation.setType(protoChain.Operation.Type.CREATE_ACCOUNT)
    operation.setCreateAccount(createAccount)
    return operation
}

function setMetadata (args = {}) {
    const {
        key, value, version, deleteFlag
    } = args

    const setMetadata = new protoChain.OperationSetMetadata()
    setMetadata.setKey(key)
    setMetadata.setValue(value)
    setMetadata.setVersion(Number(version))
    setMetadata.setDeleteFlag(deleteFlag)
    let operation = new protoChain.Operation()
    operation.setType(protoChain.Operation.Type.SET_METADATA)
    operation.setSetMetadata(setMetadata)
    return operation
}

function createContract (args = {}) {
    const {
        initBalance, payload, sourceAddress, initInput, type
    } = args

    const defaultTxThreshold = 1
    const defaultMasterWeight = 0

    const threshold = new protoChain.AccountThreshold()
    threshold.setTxThreshold(defaultTxThreshold)

    const privilege = new protoChain.AccountPrivilege()
    privilege.setThresholds(threshold)
    if (defaultMasterWeight !== 0 && defaultMasterWeight !== '0') {
        privilege.setMasterWeight(defaultMasterWeight)
    }

    const contractMsg = new protoChain.Contract()
    contractMsg.setPayload(payload)
    contractMsg.setType(type)
    const createAccount = new protoChain.OperationCreateAccount()
    if (initBalance !== 0 && initBalance !== '0') {
        createAccount.setInitBalance(long.fromValue(initBalance))
    }
    createAccount.setPriv(privilege)
    createAccount.setContract(contractMsg)
    if (initInput) {
        createAccount.setInitInput(initInput)
    }

    const operation = new protoChain.Operation()
    operation.setType(protoChain.Operation.Type.CREATE_ACCOUNT)
    operation.setCreateAccount(createAccount)
    if (sourceAddress) {
        operation.setSourceAddress(sourceAddress)
    }
    return operation
}
function isAvailableValue (str, from = -1, to = long.MAX_VALUE) {
    const reg = /^(0|([1-9]\d*))$/
    return (
        is.string(str) &&
        reg.test(str) &&
        long.fromValue(str).greaterThan(from) &&
        long.fromValue(str).lessThanOrEqual(to)
    )
};

function accountSetPrivilegeOperation (args = {}) {
    const signers = args.signers
    const typeThresholds = args.typeThresholds
    const signerList = []
    const typeThresholdsList = []
    const signer = new protoChain.Signer()
    if (is.array(signers) && signers.length > 0) {
        let msg = ''
        signers.some(item => {
            if (!keypair.isAddress(item.address)) {
                msg = 'INVALID_SIGNER_ADDRESS_ERROR'
                return true
            }
            let maxInt32 = Math.pow(2, 32) - 1
            if (!isAvailableValue(item.weight, -1, maxInt32)) {
                msg = 'INVALID_SIGNER_WEIGHT_ERROR'
                return true
            }
            signer.setAddress(item.address)
            signer.setWeight(item.weight)
            signerList.push(signer)
        })

        if (msg !== '') {
            return this._responseError(errors[msg])
        }
    }
    const typeThreshold = new protoChain.OperationTypeThreshold()
    if (is.array(typeThresholds) && typeThresholds.length > 0) {
        let msg = ''
        typeThresholds.some(item => {
            if (!isAvailableValue(item.type, -1, 100)) {
                msg = 'INVALID_OPERATION_TYPE_ERROR'
                return true
            }

            if (!isAvailableValue(item.threshold)) {
                msg = 'INVALID_TYPE_THRESHOLD_ERROR'
                return true
            }
            typeThreshold.setType(item.type)
            typeThreshold.setThreshold(item.threshold)
            typeThresholdsList.push(typeThreshold)
        })

        if (msg !== '') {
            return this._responseError(errors[msg])
        }
    }

    const setPrivilege = new protoChain.OperationSetPrivilege()
    setPrivilege.setSignersList(signerList)
    setPrivilege.setTxThreshold(args.txThreshold)
    setPrivilege.setTypeThresholdsList(typeThresholdsList)
    let maxInt32 = Math.pow(2, 32) - 1
    if (isAvailableValue(args.masterWeight, 1, maxInt32)) {
        setPrivilege.setMasterWeight(args.masterWeight)
    }

    let operation = new protoChain.Operation()
    operation.setType(protoChain.Operation.Type.SET_PRIVILEGE)
    operation.setSetPrivilege(setPrivilege)
    return operation

};

module.exports = {
    payCoin,
    accountSetPrivilegeOperation,
    activateAccount,
    setMetadata,
    createContract
}
