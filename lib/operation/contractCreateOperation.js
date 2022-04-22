'use strict'

function ContractCreateOperation (initBalance, type, payload, initInput) {
    this.initBalance = initBalance
    this.type = type
    this.payload = payload
    this.initInput = initInput
    this.operationType = 'CONTRACT_CREATE'
    this.actionType = 1

}
// set 方法
ContractCreateOperation.prototype.setInitBalance = function (val) {
    this.initBalance = val
}
ContractCreateOperation.prototype.setType = function (val) {
    this.type = val
}
ContractCreateOperation.prototype.setPayload = function (val) {
    this.payload = val
}
ContractCreateOperation.prototype.setInitInput = function (val) {
    this.initInput = val
}

// get 方法
ContractCreateOperation.prototype.getInitBalance = function () {
    return this.initBalance
}
ContractCreateOperation.prototype.getType = function () {
    return this.type
}
ContractCreateOperation.prototype.getPayload = function () {
    return this.payload
}
ContractCreateOperation.prototype.getInitInput = function () {
    return this.initInput
}
ContractCreateOperation.prototype.getOperationType = function () {
    return this.operationType
}
ContractCreateOperation.prototype.getActionType = function () {
    return this.actionType
}

module.exports = ContractCreateOperation
