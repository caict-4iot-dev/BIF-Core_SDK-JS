'use strict'
const is = require('is-type-of')
const keypair = require('../keypair')
const errors = require('../exception')
const proto = exports

proto.accountActivateOperation = function (args) {

    if (is.array(args) || !is.object(args) || JSON.stringify(args) === '{}') {
        return this._responseError(errors.REQUEST_NULL_ERROR)
    }

    const schema = {
        sourceAddress: {
            required: true,
            address: true
        },
        privateKey: {
            required: true,
            privateKey: true
        },
        destAddress: {
            required: true,
            address: true
        },
        initBalance: {
            required: true,
            numeric: true
        }
    }

    if (!this._validate(args, schema).tag) {
        const msg = this._validate(args, schema).msg
        return this._responseError(errors[msg])
    }

    if (args.sourceAddress && args.destAddress === args.sourceAddress) {
        return this._responseError(errors.SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR)
    }

    return this._responseData(true)
}

proto.accountSetMetadataOperation = function (args) {

    if (is.array(args) || !is.object(args) || JSON.stringify(args) === '{}') {
        return this._responseError(errors.REQUEST_NULL_ERROR)
    }

    const schema = {
        key: {
            required: true,
            string: true
        },
        value: {
            required: true,
            string: true
        },
        sourceAddress: {
            required: true,
            address: true
        },
        privateKey: {
            required: true,
            privateKey: true
        },
        deleteFlag: {
            required: false,
            boolean: true
        }
        // ,
        // remarks: {
        //     required: false,
        //     string: true
        // }
    }

    if (!this._validate(args, schema).tag) {
        const msg = this._validate(args, schema).msg
        return this._responseError(errors[msg])
    }

    let value = args.value

    if (!is.string(value) ||
        value.trim().length === 0 ||
        value.length > 256000) {
        return this._responseError(errors.INVALID_DATAVALUE_ERROR)
    }

    if (args.version && !this._isAvailableVersion(args.version)) {
        return this._responseError(errors.INVALID_DATAVERSION_ERROR)
    }

    return this._responseData(true)

}

proto.accountSetPrivilegeOperation = function (args = {}) {

    if (is.array(args) || !is.object(args) || JSON.stringify(args) === '{}') {
        return this._responseError(errors.REQUEST_NULL_ERROR)
    }

    const schema = {
        sourceAddress: {
            required: false,
            address: true
        },
        privateKey: {
            required: true,
            privateKey: true
        }
        // ,
        // remarks: {
        //     required: false,
        //     string: true
        // }
    }

    if (!this._validate(args, schema).tag) {
        const msg = this._validate(args, schema).msg
        return this._responseError(errors[msg])
    }

    let maxInt32 = Math.pow(2, 32) - 1

    if (!is.undefined(args.masterWeight) && !this._isAvailableValue(args.masterWeight, -1, maxInt32)) {
        return this._responseError(errors.INVALID_MASTERWEIGHT_ERROR)
    }

    if (!is.undefined(args.txThreshold) && !this._isAvailableValue(args.txThreshold)) {
        return this._responseError(errors.INVALID_TX_THRESHOLD_ERROR)
    }

    const signers = args.signers
    const typeThresholds = args.typeThresholds

    if (is.array(signers) && signers.length > 0) {
        let msg = ''
        signers.some(item => {
            if (!keypair.isAddress(item.address)) {
                msg = 'INVALID_SIGNER_ADDRESS_ERROR'
                return true
            }

            if (!this._isAvailableValue(item.weight, -1, maxInt32)) {
                msg = 'INVALID_SIGNER_WEIGHT_ERROR'
                return true
            }
        })

        if (msg !== '') {
            return this._responseError(errors[msg])
        }
    }

    if (is.array(typeThresholds) && typeThresholds.length > 0) {
        let msg = ''
        typeThresholds.some(item => {
            if (!this._isAvailableValue(item.type, -1, 100)) {
                msg = 'INVALID_OPERATION_TYPE_ERROR'
                return true
            }

            if (!this._isAvailableValue(item.threshold)) {
                msg = 'INVALID_TYPE_THRESHOLD_ERROR'
                return true
            }
        })

        if (msg !== '') {
            return this._responseError(errors[msg])
        }
    }

    return this._responseData(true)

}
