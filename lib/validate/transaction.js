'use strict'
const is = require('is-type-of')
const errors = require('../exception')
const proto = exports

proto.SendOperation = function (args) {

    if (is.array(args) || !is.object(args)) {
        return this._responseError(errors.INVALID_ARGUMENTS)
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
        amount: {
            required: true,
            numeric: true
        }
    }

    if (!this._validate(args, schema).tag) {
        const msg = this._validate(args, schema).msg
        return this._responseError(errors[msg])
    }

    return this._responseData(true)

}
proto.PrivateContractCallOperation = function (args) {

    if (is.array(args) || !is.object(args)) {
        return this._responseError(errors.INVALID_ARGUMENTS)
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
        input: {
            required: true,
            string: true
        },
        from: {
            required: true,
            string: true
        },
        destAddress: {
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

proto.PrivateContractCreateOperation = function (args) {

    if (is.array(args) || !is.object(args)) {
        return this._responseError(errors.INVALID_ARGUMENTS)
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
        payload: {
            required: true,
            string: true
        },
        initInput: {
            required: false,
            string: true
        },
        from: {
            required: true,
            string: true
        }
    }

    if (!this._validate(args, schema).tag) {
        const msg = this._validate(args, schema).msg
        return this._responseError(errors[msg])
    }
    return this._responseData(true)

}
