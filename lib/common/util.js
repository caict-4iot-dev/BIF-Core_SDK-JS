'use strict'
const is = require('is-type-of')
const long = require('long')
const JSONbig = require('json-bigint')
const BigNumber = require('bignumber.js')
const keypair = require('../keypair')
const proto = exports

proto._response = function (obj) {
    const data = {
        errorCode: obj.error_code || 0,
        errorDesc: obj.error_desc || 'Success'
    }

    if (is.object(obj) && obj.error_code) {
        if (obj.error_code === 0) {
            data.result = obj.result || {}
        } else {
            data.errorDesc = obj.error_desc || ''
            data.result = {}
        }
    } else {
        data.result = obj
    }

    return JSONbig.stringify(data)
}

proto._isEmptyString = function (str) {
    if (!is.string(str)) {
        throw new Error('str must be a string')
    }
    return (str.trim().length === 0)
}

proto._postData = function (blob, signature) {
    const data = {
        items: [
            {
                transaction_blob: blob,
                signatures: signature
            }
        ]
    }
    return JSONbig.stringify(data)
}

proto._isBigNumber = function (object) {
    return object instanceof BigNumber ||
        (object && object.constructor && object.constructor.name === 'BigNumber')
}

proto._toBigNumber = function (number) {
    number = number || 0
    //
    if (this._isBigNumber(number)) {
        return number
    }
    return new BigNumber(number)
}

proto._stringFromBigNumber = function (number) {
    return this._toBigNumber(number).toString(10)
}

proto._verifyValue = function (str) {
    const reg = /^[1-9]\d*$/
    return (
        is.string(str) &&
        reg.test(str) &&
        long.fromValue(str).greaterThan(0) &&
        long.fromValue(str).lessThanOrEqual(long.MAX_VALUE)
    )
}

proto._isAvailableValue = function (str, from = -1, to = long.MAX_VALUE) {
    const reg = /^(0|([1-9]\d*))$/
    return (
        is.string(str) &&
        reg.test(str) &&
        long.fromValue(str).greaterThan(from) &&
        long.fromValue(str).lessThanOrEqual(to)
    )
}

proto._responseData = function (data) {
    const errorCode = 0
    const errorDesc = 'Success'

    return {
        errorCode,
        errorDesc,
        result: data
    }
}

proto._responseError = function (message) {
    if (!message) {
        throw new Error('require message')
    }
    const errorCode = message.CODE

    return {
        errorCode,
        errorDesc: message.MSG
    }
}

proto._isHexString = function (str) {
    if ((str === '' || !is.string(str))) {
        return false
    }
    const hexString = Buffer.from(str, 'hex').toString('hex')
    return (hexString === str)
}

proto._isString = function (str) {
    if (!is.string(str) ||
        str.trim().length === 0 ) {
        return false
    }
    return true
}

proto._isOperation = function (arr) {
    let tag = true
    if (!is.array(arr) || arr.length === 0) {
        tag = false
        return tag
    }

    arr.some(item => {
        if (!is.object(item)) {
            tag = false
            return true
        }
        if (!item.type || !item.data) {
            tag = false
            return true
        }
    })

    return tag
}

/**
 *
 * @param obj
 * @param schema
 * @returns {boolean}
 * @private
 *
 * eg:
    schema: {
      required: false,
      string: true,
      address: true,
      numeric: true,
    }
 */
proto._validate = function (obj, schema) {
    let tag = true
    let msg = ''

    if (!is.object(obj) || !is.object(schema)) {
        tag = false
        msg = 'INVALID_NUMBER_OF_ARG'
        return {
            tag,
            msg
        }
    }

    Object.keys(schema).some(item => {
        // required is true
        if (schema[item].required && is.undefined(obj[item])) {
            obj[item] = ''
        }

        // numeric is true
        if (!is.undefined(obj[item]) &&
            schema[item].numeric &&
            !this._verifyValue(obj[item])) {
            tag = false

            switch (item) {
                case 'amount':
                    msg = 'INVALID_AMOUNT_ERROR'
                    break
                case 'gasPrice':
                    msg = 'INVALID_GASPRICE_ERROR'
                    break
                case 'feeLimit':
                    msg = 'INVALID_FEELIMIT_ERROR'
                    break
                case 'ceilLedgerSeq':
                    msg = 'INVALID_CEILLEDGERSEQ_ERROR'
                    break
                case 'nonce':
                    msg = 'INVALID_NONCE_ERROR'
                    break
                case 'initBalance':
                    msg = 'INVALID_INITBALANCE_ERROR'
                    break
                case 'signtureNumber':
                    msg = 'INVALID_SIGNATURENUMBER_ERROR'
                    break
                case 'totalSupply':
                    msg = 'INVALID_TOKEN_TOTALSUPPLY_ERROR'
                    break
                case 'tokenAmount':
                    msg = 'INVALID_TOKEN_AMOUNT_ERROR'
                    break
                default:
                    msg = 'REQUEST_NULL_ERROR'
            }

            return true
        }

        // privateKeys is true
        if (!is.undefined(obj[item]) &&
            schema[item].privateKeys &&
            !keypair.isPrivateKey(obj[item])) {
            tag = false
            msg = 'PRIVATEKEY_ONE_ERROR'
            return true
        }
        if (!is.undefined(obj[item]) &&
            schema[item].privateKey &&
            !keypair.isPrivateKey(obj[item])) {
            tag = false
            msg = 'PRIVATEKEY_NULL_ERROR'
            return true
        }
        // address is true
        if (!is.undefined(obj[item]) &&
            schema[item].address &&
            !keypair.isAddress(obj[item])) {
            tag = false

            switch (item) {
                case 'sourceAddress':
                    msg = 'INVALID_SOURCEADDRESS_ERROR'
                    break
                case 'destAddress':
                    msg = 'INVALID_DESTADDRESS_ERROR'
                    break
                case 'issuer':
                    msg = 'INVALID_ISSUER_ADDRESS_ERROR'
                    break
                case 'address':
                    msg = 'INVALID_ADDRESS_ERROR'
                    break
                case 'contractAddress':
                    msg = 'INVALID_CONTRACTADDRESS_ERROR'
                    break
                case 'fromAddress':
                    msg = 'INVALID_FROMADDRESS_ERROR'
                    break
                case 'spender':
                    msg = 'INVALID_SPENDER_ERROR'
                    break
                case 'tokenOwner':
                    msg = 'INVALID_TOKENOWNER_ERRPR'
                    break
                default:
                    msg = 'INVALID_ARGUMENTS'
            }

            return true
        }

        // hex is true
        if (!is.undefined(obj[item]) &&
            schema[item].hex &&
            !this._isHexString(obj[item])) {
            tag = false

            switch (item) {
                case 'metadata':
                    msg = 'METADATA_NOT_HEX_STRING_ERROR'
                    break
                case 'blob':
                    msg = 'INVALID_SERIALIZATION_ERROR'
                    break
                default:
                    msg = 'METADATA_NOT_HEX_STRING_ERROR'
            }

            return true
        }

        // string is true
        if (!is.undefined(obj[item]) &&
            schema[item].string &&
            !this._isString(obj[item])) {
            tag = false

            switch (item) {
                case 'from':
                    msg = 'INVALID_PRITX_FROM_ERROR'
                    break
                case 'to':
                    msg = 'INVALID_PRITX_TO_ERROR'
                    break
                case 'data':
                    msg = 'INVALID_LOG_DATA_ERROR'
                    break
                case 'payload':
                    msg = 'PAYLOAD_EMPTY_ERROR'
                    break
                case 'name':
                    msg = 'INVALID_TOKEN_NAME_ERROR'
                    break
                case 'symbol':
                    msg = 'INVALID_TOKEN_SYMBOL_ERROR'
                    break
                case 'key':
                    msg = 'INVALID_DATAKEY_ERROR'
                    break
                case 'value':
                    msg = 'INVALID_DATAVALUE_ERROR'
                    break
                default:
                    msg = 'INVALID_ARGUMENTS'
            }

            return true
        }

    })

    return {
        tag,
        msg
    }
}

proto._bufToHex = function (buf) {
    const utf8Str = buf.toString('utf8')
    return Buffer.from(utf8Str, 'utf8').toString('hex')
}

proto._isSignature = function (arr) {
    let tag = true
    if (!is.array(arr) || arr.length === 0) {
        tag = false
        return tag
    }

    arr.some(item => {
        if (!is.object(item)) {
            tag = false
            return true
        }

        if (!item.signData || !item.publicKey) {
            tag = false
            return true
        }

        if (!this._isHexString(item.signData)) {
            tag = false
            return true
        }

        if (!keypair.isPublicKey(item.publicKey)) {
            tag = false
            return true
        }
    })

    return tag
}
proto._bigNumberToString = function (obj, base) {
    // setup base
    base = base || 10

    // check if obj is type object, not an array and does not have BN properties
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj) && !('lessThan' in obj)) {
        // move through plain object
        Object.keys(obj).forEach(function (key) {
            // recurively converty item
            obj[key] = proto._bigNumberToString(obj[key], base)
        })
    }

    // obj is an array
    if (Array.isArray(obj)) {
        // convert items in array
        obj = obj.map(function (item) {
            // convert item to a string if bignumber
            return proto._bigNumberToString(item, base)
        })
    }

    // if obj is number, convert to string
    if (typeof obj === 'number') { return obj + '' }

    // if not an object bypass
    if (typeof obj !== 'object' || obj === null) { return obj }

    // if the object to does not have BigNumber properties, bypass
    if (!('toString' in obj) || !('lessThan' in obj)) { return obj }

    // if object has bignumber properties, convert to string with base
    return obj.toString(base)
}

proto._longToInt = function (obj) {
    // check if obj is type object, not an array and does not have long properties
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj) && !('low' in obj)) {
        // move through plain object
        Object.keys(obj).forEach(function (key) {
            // recurively converty item
            obj[key] = proto._longToInt(obj[key])
        })
    }

    // obj is an array
    if (Array.isArray(obj)) {
        // convert items in array
        obj = obj.map(function (item) {
            // convert item to an int if long
            return proto._longToInt(item)
        })
    }

    // if not an object bypass
    if (typeof obj !== 'object' || obj === null) { return obj }

    // if the object to does not have long properties, bypass
    if (!('low' in obj)) { return obj }

    // if object has long properties, convert to int
    return long.fromValue(obj).toNumber()
}

proto._isAvailableVersion = function (str) {
    const reg = /^\d+(\.\d+)?$/
    return (
        is.string(str) &&
        reg.test(str) &&
        long.fromValue(str).greaterThanOrEqual(0) &&
        long.fromValue(str).lessThanOrEqual(long.MAX_VALUE)
    )
}

proto._isAvailableBu = function (str) {
    const reg = /^(([1-9]\d*)+|0)(\.\d{1,8})?$/
    return (
        is.string(str) &&
        reg.test(str) &&
        long.fromValue(str).greaterThanOrEqual(0) &&
        long.fromValue(str).lessThanOrEqual(long.MAX_VALUE.divide(Math.pow(10, 8)))
    )
}
