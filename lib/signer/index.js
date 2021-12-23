'use strict'
const keypair = require('../keypair')

/**
 * Generate the signature
 *
 * @param {String} message
 * @param {String} privateKey
 * @returns {String}
 */
function sign (message, privateKey) {
    return keypair.sign(message, privateKey)
}

/**
 * Verify the signature
 *
 * @param  {String} message
 * @param  {String} signature
 * @param  {String} publicKey
 * @returns {Boolean}
 */
function verify (message, signature, publicKey) {
    return keypair.verify(message, signature, publicKey)
}

module.exports = {
    sign,
    verify
}
