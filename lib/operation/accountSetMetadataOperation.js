'use strict'

function AccountSetMetadataOperation (key, value, version, deleteFlag) {
    this.key = key
    this.value = value
    this.version = version
    this.deleteFlag = deleteFlag
    this.operationType = 'ACCOUNT_SET_METADATA'
    this.actionType = 4
}
// set 方法
AccountSetMetadataOperation.prototype.setKey = function (val) {
    this.key = val
}
AccountSetMetadataOperation.prototype.setValue = function (val) {
    this.value = val
}

AccountSetMetadataOperation.prototype.setVersion = function (val) {
    this.version = val
}
AccountSetMetadataOperation.prototype.setDeleteFlag = function (val) {
    this.deleteFlag = val
}

// get 方法
AccountSetMetadataOperation.prototype.getKey = function () {
    return this.key
}
AccountSetMetadataOperation.prototype.getValue = function () {
    return this.value
}
AccountSetMetadataOperation.prototype.getVersion = function () {
    return this.version
}
AccountSetMetadataOperation.prototype.getDeleteFlag = function () {
    return this.deleteFlag
}
AccountSetMetadataOperation.prototype.getOperationType = function () {
    return this.operationType
}
AccountSetMetadataOperation.prototype.getActionType = function () {
    return this.actionType
}

module.exports = AccountSetMetadataOperation
