'use strict'
const ContractInvokeOperation = require('./contractInvokeOperation')
function ContractInvokeRequestOperation (senderAddress, feeLimit, gasPrice, ceilLedgerSeq, remarks, privateKey, domainId) {

    this.operations = ContractInvokeOperation
    this.senderAddress = senderAddress
    this.feeLimit = feeLimit
    this.gasPrice = gasPrice
    this.ceilLedgerSeq = ceilLedgerSeq
    this.remarks = remarks
    this.privateKey = privateKey
    this.domainId = domainId
}
// set 方法
ContractInvokeRequestOperation.prototype.setOperations = function (val) {
    this.operations = val
}
ContractInvokeRequestOperation.prototype.setSenderAddress = function (val) {
    this.senderAddress = val
}
ContractInvokeRequestOperation.prototype.setFeeLimit = function (val) {
    this.feeLimit = val
}
ContractInvokeRequestOperation.prototype.setGasPrice = function (val) {
    this.gasPrice = val
}
ContractInvokeRequestOperation.prototype.setCeilLedgerSeq = function (val) {
    this.ceilLedgerSeq = val
}
ContractInvokeRequestOperation.prototype.setRemarks = function (val) {
    this.remarks = val
}
ContractInvokeRequestOperation.prototype.setPrivateKey = function (val) {
    this.privateKey = val
}
ContractInvokeRequestOperation.prototype.setDomainId = function (val) {
    this.domainId = val
}

// get 方法
ContractInvokeRequestOperation.prototype.getOperations = function () {
    return this.operations
}
ContractInvokeRequestOperation.prototype.getSenderAddress = function () {
    return this.senderAddress
}
ContractInvokeRequestOperation.prototype.getFeeLimit = function () {
    return this.feeLimit
}
ContractInvokeRequestOperation.prototype.getGasPrice = function () {
    return this.gasPrice
}
ContractInvokeRequestOperation.prototype.getCeilLedgerSeq = function () {
    return this.ceilLedgerSeq
}
ContractInvokeRequestOperation.prototype.getRemarks = function () {
    return this.remarks
}
ContractInvokeRequestOperation.prototype.getPrivateKey = function () {
    return this.privateKey
}
ContractInvokeRequestOperation.prototype.getDomainId = function () {
    return this.domainId
}

module.exports = ContractInvokeRequestOperation
