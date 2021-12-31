'use strict'

function PrivateContractCallOperation(destAddress, type, from, to, input) {
    this.destAddress = destAddress
    this.type = type
    this.from = from
    this.to = to
    this.input = input
    this.operationType = 'PRIVATE_CONTRACT_CALL'
    this.actionType = 13
}
// set 方法
PrivateContractCallOperation.prototype.setDestAddress = function (val) {
    this.destAddress = val
}
PrivateContractCallOperation.prototype.setType = function (val) {
    this.type = val
}

PrivateContractCallOperation.prototype.setFrom = function (val) {
    this.from = val
}
PrivateContractCallOperation.prototype.setTo = function (val) {
    this.to = val
}
PrivateContractCallOperation.prototype.setInput = function (val) {
    this.input = val
}

// get 方法
PrivateContractCallOperation.prototype.getDestAddress = function () {
    return this.destAddress
}
PrivateContractCallOperation.prototype.getType = function () {
    return this.type
}
PrivateContractCallOperation.prototype.getFrom = function () {
    return this.from
}
PrivateContractCallOperation.prototype.getTo = function () {
    return this.to
}
PrivateContractCallOperation.prototype.getInput = function () {
    return this.input
}
PrivateContractCallOperation.prototype.getOperationType = function () {
    return this.operationType
}
PrivateContractCallOperation.prototype.getActionType = function () {
    return this.actionType
}
module.exports = PrivateContractCallOperation
