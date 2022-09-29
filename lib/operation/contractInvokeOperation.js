'use strict'

function ContractInvokeOperation (contractAddress, amount, input) {
    this.contractAddress = contractAddress
    this.amount = amount
    this.input = input
    this.operationType = 'CONTRACT_INVOKE'
    this.actionType = 7
}
// set 方法
ContractInvokeOperation.prototype.setContractAddress = function (val) {
    this.contractAddress = val
}
ContractInvokeOperation.prototype.setAmount = function (val) {
    this.amount = val
}
ContractInvokeOperation.prototype.setInput = function (val) {
    this.input = val
}
ContractInvokeOperation.prototype.setOperationType = function (val) {
    this.operationType = val
}
ContractInvokeOperation.prototype.setActionType = function (val) {
    this.actionType = val
}

// get 方法
ContractInvokeOperation.prototype.getContractAddress = function () {
    return this.contractAddress
}
ContractInvokeOperation.prototype.getAmount = function () {
    return this.amount
}
ContractInvokeOperation.prototype.getInput = function () {
    return this.input
}
ContractInvokeOperation.prototype.getOperationType = function () {
    return this.operationType
}
ContractInvokeOperation.prototype.getActionType = function () {
    return this.actionType
}

module.exports = ContractInvokeOperation
