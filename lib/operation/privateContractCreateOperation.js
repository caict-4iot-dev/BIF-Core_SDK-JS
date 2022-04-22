'use strict'

function PrivateContractCreateOperation (payload, type, from, to, initInput) {
    this.payload = payload
    this.type = type
    this.from = from
    this.to = to
    this.initInput = initInput
    this.operationType = 'PRIVATE_CONTRACT_CREATE'
    this.actionType = 12
}
// set 方法
PrivateContractCreateOperation.prototype.setPayload = function (val) {
    this.payload = val
}
PrivateContractCreateOperation.prototype.setType = function (val) {
    this.type = val
}
PrivateContractCreateOperation.prototype.setFrom = function (val) {
    this.from = val
}
PrivateContractCreateOperation.prototype.setTo = function (val) {
    this.to = val
}
PrivateContractCreateOperation.prototype.setInitInput = function (val) {
    this.initInput = val
}

// get 方法
PrivateContractCreateOperation.prototype.getPayload = function () {
    return this.payload
}
PrivateContractCreateOperation.prototype.getType = function () {
    return this.type
}
PrivateContractCreateOperation.prototype.getFrom = function () {
    return this.from
}
PrivateContractCreateOperation.prototype.getTo = function () {
    return this.to
}
PrivateContractCreateOperation.prototype.getInitInput = function () {
    return this.initInput
}
PrivateContractCreateOperation.prototype.getOperationType = function () {
    return this.operationType
}
PrivateContractCreateOperation.prototype.getActionType = function () {
    return this.actionType
}

module.exports = PrivateContractCreateOperation
