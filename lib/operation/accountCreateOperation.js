'use strict'

function AccountCreateOperation(destAddress, initBalance) {
    this.destAddress = destAddress
    this.initBalance = initBalance
    this.operationType = 'ACCOUNT_ACTIVATE'
    this.actionType = 1

}
// set 方法
AccountCreateOperation.prototype.setDestAddress = function (val) {
    this.destAddress = val
}
AccountCreateOperation.prototype.setInitBalance = function (val) {
    this.initBalance = val
}

// get 方法
AccountCreateOperation.prototype.getDestAddress = function () {
    return this.destAddress
}
AccountCreateOperation.prototype.getInitBalance = function () {
    return this.initBalance
}
AccountCreateOperation.prototype.getOperationType = function () {
    return this.operationType
}
AccountCreateOperation.prototype.getActionType = function () {
    return this.actionType
}
module.exports = AccountCreateOperation
