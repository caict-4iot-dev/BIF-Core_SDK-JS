'use strict'

const AccountCreateOperation = require('./accountCreateOperation')
const AccountSetMetadataOperation = require('./accountSetMetadataOperation')
const AccountSetPrivilegeOperation = require('./accountSetPrivilegeOperation')
const ContractCreateOperation = require('./contractCreateOperation')
const ContractInvokeOperation = require('./contractInvokeOperation')
const GasSendOperation = require('./gasSendOperation')
const PrivateContractCallOperation = require('./privateContractCallOperation')
const PrivateContractCreateOperation = require('./privateContractCreateOperation')

module.exports = Operation

function Operation () {
    this.accountCreateOperation = new AccountCreateOperation()
    this.accountSetMetadataOperation = new AccountSetMetadataOperation()
    this.accountSetPrivilegeOperation = new AccountSetPrivilegeOperation()
    this.contractCreateOperation = new ContractCreateOperation()
    this.contractInvokeOperation = new ContractInvokeOperation()
    this.gasSendOperation = new GasSendOperation()
    this.privateContractCallOperation = new PrivateContractCallOperation()
    this.privateContractCreateOperation = new PrivateContractCreateOperation()
}
