'use strict'
const is = require('is-type-of')
const errors = require('../exception')
const proto = exports

proto.contractCreateOperation = function (args) {

    if (is.array(args) || !is.object(args) || JSON.stringify(args) === '{}') {
        return this._responseError(errors.REQUEST_NULL_ERROR)
    }

    const schema = {
        sourceAddress: {
            required: true,
            string: true,
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

    if (args.type !== 0 && args.type !== 1 && args.type !== '0' && args.type !== '1' && args.type != null && args.type != '') {
        return this._responseError(errors.INVALID_CONTRACT_TYPE_ERROR)
    }

    if (!is.string(args.payload) ||
        args.payload.trim().length === 0) {
        return this._responseError(errors.PAYLOAD_EMPTY_ERROR)
    }

    return this._responseData(true)
}

proto.contractQueryOperation = function (args) {

    if (is.array(args) || !is.object(args) || JSON.stringify(args) === '{}') {
        return this._responseError(errors.REQUEST_NULL_ERROR)
    }

    const schema = {
        contractAddress: {
            required: true,
            address: true
        }
    }

    if (!this._validate(args, schema).tag) {
        const msg = this._validate(args, schema).msg
        return this._responseError(errors[msg])
    }
    return this._responseData(true)
}

proto.contractInvokeOperation = function (args) {

    if (is.array(args) || !is.object(args) || JSON.stringify(args) === '{}') {
        return this._responseError(errors.REQUEST_NULL_ERROR)
    }

    const schema = {
        contractAddress: {
            required: true,
            address: true
        },
        sourceAddress: {
            required: false,
            address: true
        },
        privateKey: {
            required: true,
            privateKey: true
        },
        amount: {
            required: true,
            numeric: true
        }
    }

    if (!this._validate(args, schema).tag) {
        const msg = this._validate(args, schema).msg
        return this._responseError(errors[msg])
    }

    if (!is.undefined(args.amount)) {
        if (!this._isAvailableValue(args.amount)) {
            return this._responseError(errors.INVALID_AMOUNT_ERROR)
        }
    }

    return this._responseData(true)

}
