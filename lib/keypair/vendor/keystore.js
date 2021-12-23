'use strict'
const crypto = require('./crypto')
let keystore = {}

keystore.create = (keystoreContent, password, ver) => {
    const cryptoData = crypto.encrypt(password, keystoreContent)
    let data = {
        cypher_text: cryptoData.encrypted,
        aesctr_iv: cryptoData.iv,
        scrypt_params: {
            n: crypto.scryptParams.SCRYPT_PARAMS_COST_FACTOR,
            p: crypto.scryptParams.SCRYPT_PARAMS_PARALLELIZATION_FACTOR,
            r: crypto.scryptParams.SCRYPT_PARAMS_BLOCK_SIZE_FACTOR,
            salt: cryptoData.salt
        },
        version: ver || 2
    }
    return data
}

keystore.imported = (keystoreContent, password, ver) => {
    return crypto.decrypt(password, keystoreContent)
}

module.exports = keystore
