'use strict'

function AccountSetPrivilegeOperation(masterWeight, signers, txThreshold, typeThresholds) {
    this.masterWeight = masterWeight
    this.signers = signers
    this.txThreshold = txThreshold
    this.typeThresholds = typeThresholds
    this.operationType = 'ACCOUNT_SET_PRIVILEGE'
    this.actionType = 9
}
// set 方法
AccountSetPrivilegeOperation.prototype.setMasterWeight = function (val) {
    this.masterWeight = val
}
AccountSetPrivilegeOperation.prototype.setSigners = function (val) {
    this.signers = val
}

AccountSetPrivilegeOperation.prototype.setTxThreshold = function (val) {
    this.txThreshold = val
}
AccountSetPrivilegeOperation.prototype.setTypeThresholds = function (val) {
    this.typeThresholds = val
}

// get 方法
AccountSetPrivilegeOperation.prototype.getMasterWeight = function () {
    return this.masterWeight
}
AccountSetPrivilegeOperation.prototype.getSigners = function () {
    return this.signers
}
AccountSetPrivilegeOperation.prototype.getTxThreshold = function () {
    return this.txThreshold
}
AccountSetPrivilegeOperation.prototype.getTypeThresholds = function () {
    return this.typeThresholds
}
AccountSetPrivilegeOperation.prototype.getOperationType = function () {
    return this.operationType
}
AccountSetPrivilegeOperation.prototype.getActionType = function () {
    return this.actionType
}
module.exports = AccountSetPrivilegeOperation
