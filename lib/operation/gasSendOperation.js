'use strict'

function GasSendOperation(destAddress, amount) {
    this.destAddress = destAddress
    this.amount = amount
    this.operationType = 'GAS_SEND'
    this.actionType = 7
}
// set 方法
GasSendOperation.prototype.setDestAddress = function (val) {
    this.destAddress = val
}
GasSendOperation.prototype.setAmount = function (val) {
    this.amount = val
}

// get 方法
GasSendOperation.prototype.getDestAddress = function () {
    return this.destAddress
}
GasSendOperation.prototype.getAmount = function () {
    return this.amount
}
GasSendOperation.prototype.getOperationType = function () {
    return this.operationType
}
GasSendOperation.prototype.getActionType = function () {
    return this.actionType
}
module.exports = GasSendOperation
