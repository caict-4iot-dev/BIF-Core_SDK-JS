'use strict'
const GasSendOperation = require('./gasSendOperation')
function GasSendRequestOperation (senderAddress, feeLimit, gasPrice, ceilLedgerSeq, remarks, privateKey, domainId) {

    this.operations = GasSendOperation
    this.senderAddress = senderAddress
    this.feeLimit = feeLimit
    this.gasPrice = gasPrice
    this.ceilLedgerSeq = ceilLedgerSeq
    this.remarks = remarks
    this.privateKey = privateKey
    this.domainId = domainId
}
// set 方法
GasSendRequestOperation.prototype.setOperations = function (val) {
    this.operations = val
}
GasSendRequestOperation.prototype.setSenderAddress = function (val) {
    this.senderAddress = val
}
GasSendRequestOperation.prototype.setFeeLimit = function (val) {
    this.feeLimit = val
}
GasSendRequestOperation.prototype.setGasPrice = function (val) {
    this.gasPrice = val
}
GasSendRequestOperation.prototype.setCeilLedgerSeq = function (val) {
    this.ceilLedgerSeq = val
}
GasSendRequestOperation.prototype.setRemarks = function (val) {
    this.remarks = val
}
GasSendRequestOperation.prototype.setPrivateKey = function (val) {
    this.privateKey = val
}
GasSendRequestOperation.prototype.setDomainId = function (val) {
    this.domainId = val
}

// get 方法
GasSendRequestOperation.prototype.getOperations = function () {
    return this.operations
}
GasSendRequestOperation.prototype.getSenderAddress = function () {
    return this.senderAddress
}
GasSendRequestOperation.prototype.getFeeLimit = function () {
    return this.feeLimit
}
GasSendRequestOperation.prototype.getGasPrice = function () {
    return this.gasPrice
}
GasSendRequestOperation.prototype.getCeilLedgerSeq = function () {
    return this.ceilLedgerSeq
}
GasSendRequestOperation.prototype.getRemarks = function () {
    return this.remarks
}
GasSendRequestOperation.prototype.getPrivateKey = function () {
    return this.privateKey
}
GasSendRequestOperation.prototype.getDomainId = function () {
    return this.domainId
}

module.exports = GasSendRequestOperation
