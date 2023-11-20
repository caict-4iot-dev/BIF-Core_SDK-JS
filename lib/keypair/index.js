'use strict'
const nacl = require('./vendor/nacl')
const keystore = require('./vendor/keystore')
const crypto_sm2 = require('./crypto_sm2')
const sjcl = require('brdc-sjcl')
const bip39 = require('bip39')
const bip32 = require('bip32')
// const is = require('is-type-of')
const util = require('../common/util')
const {boolean} = require('is-type-of')
const {Slip10Curve, deriveKeyByPath} = require("bitfactory-js-hd-key");
const WORDLISTS = {
    english: require('bip39/src/wordlists/english.json'),
    chinese_simplified: require('bip39/src/wordlists/chinese_simplified.json')
}
const CRYPTO_SM2 = 0x7a
const CRYPTO_ED25519 = 0x65

/**
* Get sha256 hash string
*
* @param {String} bytes
* @returns {String}
* @private
*/
function _sha256 (bytes) {
    return sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(sjcl.codec.bytes.toBits(bytes)))
}

/**
 * Create privateKey
 *
 * @param {Array} rawPrivateKey
 * @returns {String} output privateKey
 * @private
 */
function _createPrivateKey (rawPrivateKey) {
    const prefix = [0x18, 0x9E, 0x99]
    const version = [0x65, 0x66]
    const head = sjcl.bitArray.concat(prefix, version)
    let mix = sjcl.bitArray.concat(head, rawPrivateKey)
    return sjcl.codec.base58.encode(mix)
}

/**
 * Create publicKey
 *
 * @param {Array} rawPublicKey
 * @returns {String} output publicKey
 * @private
 */
function _createPublicKey (rawPublicKey) {
    const prefix = [0xb0]
    const version = [0x65, 0x66]
    const head = sjcl.bitArray.concat(prefix, version)
    const mix = sjcl.bitArray.concat(head, rawPublicKey)
    return sjcl.codec.hex.fromBits(sjcl.codec.bytes.toBits(mix))
}

/**
 * Create address
 *
 * @param {Array} rawPublicKey
 * @returns {String} output address
 * @private
 */
function _createAddress (rawPublicKey, chainCode) {
    let mix = _sha256(rawPublicKey).slice(10)
    let address = sjcl.codec.base58.encode(mix)
    if (chainCode) {
        return `did:bid:${chainCode}:ef${address}`
    }
    return `did:bid:ef${address}`
}

function getCryptoTypeFromPrivKey (key) {
    const decodedKey = sjcl.codec.base58.decode(key.trim())
    return decodedKey[3]
}

function getCryptoTypeFromPubKey (key) {
    const decodedKey = sjcl.codec.bytes.fromBits(
        sjcl.codec.hex.toBits(key.trim()))
    return decodedKey[1]
}

/**
 * Parse privateKey, get rawPrivateKey
 *
 * @param {String} privateKey
 * @returns {String} rawPrivateKey
 * @public
 */
function parsePrivateKey (privateKey) {
    if (!isPrivateKey(privateKey)) { throw new Error('invalid privateKey') }
    const decodedKey = sjcl.codec.base58.decode(privateKey)
    return decodedKey.slice(5, decodedKey.length)
}

/**
 * Parse publicKey, get rawPublicKey
 *
 * @param {String} publicKey
 * @returns {String} rawPublicKey
 * @public
 */
function parsePublicKey (publicKey) {
    if (!isPublicKey(publicKey)) { throw new Error('invalid publicKey') }
    const keyBytes = sjcl.codec.bytes.fromBits(
        sjcl.codec.hex.toBits(publicKey)
    )
    return keyBytes.slice(3, keyBytes.length)
}

/**
 * Create a single account, include privateKey publicKey and address
 *
 * @returns {Object}
 * @public
 */
function generate (chainCode) {
    const srcKeyPair = nacl.sign.keyPair()
    const seed = srcKeyPair.publicKey
    const keyPair = nacl.sign.keyPair.fromSeed(seed)
    const rawPrivateKey = Array.from(seed)
    const rawPublicKey = Array.from(keyPair.publicKey)
    // create privateKey
    const encPrivateKey = _createPrivateKey(rawPrivateKey)
    // create publicKey
    const encPublicKey = _createPublicKey(rawPublicKey)
    // create address
    const encAddress = _createAddress(rawPublicKey, chainCode)
    return {
        encPrivateKey,
        encPublicKey,
        encAddress,
        rawPrivateKey,
        rawPublicKey
    }
}

/**
 * Returns an account address, private and public key
 *
 * @param {String} privateKey
 * @public
 */
function generateByKey (encPrivateKey) {
    if (!isPrivateKey(encPrivateKey)) { throw new Error('invalid privateKey') }
    if (getCryptoTypeFromPrivKey(encPrivateKey) === CRYPTO_SM2) {
        return crypto_sm2.privateToAccount(encPrivateKey)
    }
    if (getCryptoTypeFromPrivKey(encPrivateKey) === CRYPTO_ED25519) {
        const encPublicKey = getEncPublicKey(encPrivateKey)
        const encAddress = publicToAddress(encPublicKey)
        const rawPrivateKey = parsePrivateKey(encPrivateKey)
        const rawPublicKey = parsePublicKey(encPublicKey)
        return {
            encPrivateKey,
            encPublicKey,
            encAddress,
            rawPrivateKey,
            rawPublicKey
        }
    }
    throw new Error('invalid privateKey')
}

/**
 * Returns the publicKey
 *
 * @param {String} privateKey
 * @returns {String} publicKey
 * @public
 */
function getEncPublicKey (privateKey) {
    if (!isPrivateKey(privateKey)) { throw new Error('invalid privateKey') }
    if (getCryptoTypeFromPrivKey(privateKey) === CRYPTO_SM2) {
        return crypto_sm2.privateToPublic(privateKey)
    }
    if (getCryptoTypeFromPrivKey(privateKey) === CRYPTO_ED25519) {
        const rawPrivateKey = parsePrivateKey(privateKey)
        const keyPair = nacl.sign.keyPair.fromSeed(rawPrivateKey)
        const rawPublicKey = Array.from(keyPair.publicKey)
        return _createPublicKey(rawPublicKey)
    }
    throw new Error('invalid privateKey')
}

function getEncPublicKeyByRaw (rawPublicKey, type) {
    if (!Array.isArray(rawPublicKey)) {
        throw new Error('invalid rawPublicKey')
    }
    if (type === CRYPTO_SM2) {
        return crypto_sm2._createPublicKey(rawPublicKey)
    }
    if (type === CRYPTO_ED25519) {
        return _createPublicKey(rawPublicKey)
    }
    throw new Error('invalid type')
}

function getEncPrivateKeyByRaw (rawPrivateKey, type) {
    if (!Array.isArray(rawPrivateKey)) {
        throw new Error('invalid rawPrivateKey')
    }
    if (type === CRYPTO_SM2) {
        return crypto_sm2._createPrivateKey(rawPrivateKey)
    }
    if (type === CRYPTO_ED25519) {
        return _createPrivateKey(rawPrivateKey)
    }
    throw new Error('invalid type')
}

/**
 * Returns the address
 *
 * @param {String} publicKey
 * @returns {String}
 * @public
 */
function publicToAddress (publicKey) {
    if (!isPublicKey(publicKey)) { throw new Error('invalid publicKey') }
    if (getCryptoTypeFromPubKey(publicKey) === CRYPTO_SM2) {
        return crypto_sm2.publicToAddress(publicKey)
    }
    if (getCryptoTypeFromPubKey(publicKey) === CRYPTO_ED25519) {
        const rawPublicKey = parsePublicKey(publicKey)
        return _createAddress(rawPublicKey)
    }
    throw new Error('invalid publicKey')
}

function isCryptoTagValid (asym, encode) {
    if (asym === CRYPTO_ED25519 && encode === 0x66) {
        return true
    }
    if (asym === CRYPTO_SM2 && encode === 0x66) {
        return true
    }
}

/**
 * Checks if a given string is a valid privateKey
 *
 * @param {String} key
 * @returns {Boolean}
 * @public
 */
function isPrivateKey (key) {
    try {
        if (!key || (typeof key !== 'string')) {
            return false
        }

        const decodedKey = sjcl.codec.base58.decode(key.trim())

        if (
            decodedKey[0] !== 0x18 ||
            decodedKey[1] !== 0x9e ||
            decodedKey[2] !== 0x99
        ) {
            return false
        }

        if (!isCryptoTagValid(decodedKey[3], decodedKey[4])) {
            return false
        }

        return (true)
    } catch (err) {
        return false
    }
}

/**
 * Checks if a given string is a valid publicKey
 *
 * @param {String} key
 * @returns {Boolean}
 * @public
 */
function isPublicKey (key) {
    try {
        if (!key || typeof key !== 'string') {
            return false
        }

        const keyBytes = sjcl.codec.bytes.fromBits(
            sjcl.codec.hex.toBits(key.trim())
        )

        if (
            keyBytes[0] !== 0xb0 || !isCryptoTagValid(keyBytes[1], keyBytes[2])
            // keyBytes[1] > 4 ||
            // keyBytes[1] < 1
        ) {
            return false
        }

        return (true)
    } catch (err) {
        return false
    }
}

/**
 * Checks if a given string is a valid address
 *
 * @param {String} address
 * @returns {Boolean}
 * @public
 */
function isAddress (address) {
    try {
        if (!address || typeof address !== 'string') {
            return false
        }
        const startsWithDidBid = address.startsWith('did:bid:')
        if (!startsWithDidBid) {
            return false
        }
        const items = address.split(':')
        if (items.length !== 3 && items.length !== 4) {
            return false
        }
        if (items.length === 3) {
            address = items[2]
        } else {
            address = items[3]
        }
        const prifx = address.substring(0, 2)
        if (prifx !== 'ef' && prifx !== 'zf') {
            return false
        }
        let addr = address.substring(2, address.length)
        let base58_address = []
        base58_address = sjcl.codec.base58.decode(addr)
        if (base58_address.length != 22) {
            return false
        }
        return (true)
    } catch (err) {
        return false
    }
}

function generateKeyStore (privatekey, password) {
    let regular = /[u4e00-u9fa5]/
    if (!isPrivateKey(privatekey)) {
        throw new Error('invalid privatekey')
    }
    if (!util._isString(password) || !regular.test(password)) {
        throw new Error('invalid password')
    }
    let respData = keystore.create(privatekey, password)
    respData.address = generateByKey(privatekey).address
    return respData
}

function decipherKeyStore (keystoreContent, password) {
    let regular = /[u4e00-u9fa5]/
    try {
        if (typeof keystoreContent === 'string') {
            keystoreContent = JSON.parse(keystoreContent)
        }
    } catch (e) {
        throw new Error('invalid keystoreContent')
    }
    if (!util._isString(password) || !regular.test(password)) {
        throw new Error('invalid password')
    }
    const address = keystore.imported(keystoreContent, password)
    if (address == null) {
        throw new Error('The password was wrong')
    }
    return keystore.imported(keystoreContent, password)
}

function _bytesToHex (bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16))
        hex.push((bytes[i] & 0xF).toString(16))
    }
    return hex.join('')
}

/**
 * generate child key from master key
 *
 * @param {String} privatekey
 * @param {String} chainCode
 * @param {String} serviceType
 * @param {Number} index
 * @returns {object}
 * @public
 */

function generateChild (privatekey, chainCode, serviceType, index) {
    if (getCryptoTypeFromPrivKey(privatekey) === CRYPTO_SM2) {
        return crypto_sm2.generateChild(parsePrivateKey(privatekey), chainCode, serviceType, index)
    }
    let rawPrivatekey = parsePrivateKey(privatekey)
    let path = '/0/' + chainCode + '/' + serviceType + '/' + index.toString()
    let seed = sjcl.codec.bytes.fromBits(sjcl.hash.sha256.hash(_bytesToHex(rawPrivatekey) + path))
    const keyPair = nacl.sign.keyPair.fromSeed(seed)
    const rawPrivateKey = Array.from(seed)
    const rawPublicKey = Array.from(keyPair.publicKey)
    // create privateKey
    const privateKey = _createPrivateKey(rawPrivateKey)
    // create publicKey
    const publicKey = _createPublicKey(rawPublicKey)
    // create address
    const address = _createAddress(rawPublicKey, chainCode)
    return {
        privateKey,
        publicKey,
        address,
        path
    }
}

/**
 * generate mnemonic codes
 *
 * @param {Buffer | String} entropy
 * @returns {String}
 * @public
 */
function generateMnemonicCode (entropy) {
    let word = WORDLISTS.english
    if (!util._isString(entropy)) {
        throw new Error('invalid entropy')
    }
    return bip39.entropyToMnemonic(entropy, word)
}

/**
 * generate private key from mnemonic codes
 *
 * @param {String} mnemonics
 * @param {String} hdPaths, format is "m/44'/526'/1'/0/0"
 * @returns {String}
 * @public
 */
function privateKeyFromMnemonicCode (mnemonics, hdPaths) {
    if (!util._isString(mnemonics)) {
        throw new Error('The size of mnemonicCodes must be bigger than or equal to 0')
    }
    if (!util._isString(hdPaths)) {
        throw new Error('The size of hdPaths must be bigger than or equal to 0')
    }
    const seed = bip39.mnemonicToSeedSync(mnemonics, '');
    let derivePrivateKeyRaw =  deriveKeyByPath(Slip10Curve.ED25519, hdPaths, seed.toString('hex'));
    return _createPrivateKey(Array.from(Buffer.from(derivePrivateKeyRaw.key, 'hex')))
}

function privKeyFromMCodeAndCrypto (type, mnemonics, hdPaths) {
    const seed = bip39.mnemonicToSeedSync(mnemonics, '');
    let derivePrivateKeyRaw = null;
    if (!util._isString(mnemonics)) {
        throw new Error('The size of mnemonicCodes must be bigger than or equal to 0')
    }
    if (!util._isString(hdPaths)) {
        throw new Error('The size of hdPaths must be bigger than or equal to 0')
    }
    if (type === CRYPTO_ED25519) {
        derivePrivateKeyRaw = deriveKeyByPath(Slip10Curve.ED25519, hdPaths, seed.toString('hex'));
        return _createPrivateKey(Array.from(Buffer.from(derivePrivateKeyRaw.key, 'hex')))
    } else if (type === CRYPTO_SM2) {
        derivePrivateKeyRaw = deriveKeyByPath(Slip10Curve.SM2, hdPaths, seed.toString('hex'));
        return crypto_sm2._createPrivateKey(Array.from(Buffer.from(derivePrivateKeyRaw.key, 'hex')))
    }
    throw new Error('invalid type')
}

function sign (message, privateKey) {
    if (!isPrivateKey(privateKey)) {
        throw new Error('invalid privateKey')
    }
    if (!util._isString(message)) {
        throw new Error('invalid message')
    }
    if (getCryptoTypeFromPrivKey(privateKey) === CRYPTO_SM2) {
        return crypto_sm2.sign(message, privateKey)
    }
    if (getCryptoTypeFromPrivKey(privateKey) === CRYPTO_ED25519) {
        if (typeof message === 'number') {
            message = message + ''
        }
        const buffer = Buffer.from(message, 'hex')
        const rawPrivateKey = parsePrivateKey(privateKey)
        let keyPair = nacl.sign.keyPair.fromSeed(rawPrivateKey)
        let signBytes = nacl.sign.detached(buffer, keyPair.secretKey)
        return sjcl.codec.hex.fromBits(sjcl.codec.bytes.toBits(signBytes))
    }
    throw new Error('invalid privateKey')
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
    if (!isPublicKey(publicKey)) { throw new Error('invalid publicKey') }
    if (getCryptoTypeFromPubKey(publicKey) === CRYPTO_SM2) {
        return crypto_sm2.verify(message, signature, publicKey)
    }
    if (typeof message === 'number') {
        message = message + ''
    }
    if (typeof signature !== 'string') {
        throw new TypeError('signature must be a string')
    }
    const rawPublicKey = parsePublicKey(publicKey)
    const signatureBytes = sjcl.codec.bytes.fromBits(
        sjcl.codec.hex.toBits(signature)
    )
    const buffer = Buffer.from(message, 'hex')
    return nacl.sign.detached.verify(
        buffer,
        signatureBytes,
        rawPublicKey
    )
}

function getBidAndKeyPairBySM2 (chainCode) {
    return crypto_sm2.generate(chainCode)
}

function getBidAndKeyPair (chainCode) {
    return this.generate(chainCode)
}

function privateKeyManager (type, chainCode) {
    if (type === CRYPTO_ED25519) {
        return generate(chainCode)
    }
    if (type === CRYPTO_SM2) {
        return crypto_sm2.generate(chainCode)
    }
    throw new Error('invalid type')
}

function privateKeyManagerByKey (privateKey) {
    if (!isPrivateKey(privateKey)) {
        throw new Error('invalid privateKey')
    }
    if (getCryptoTypeFromPrivKey(privateKey) === CRYPTO_ED25519) {
        return generateByKey(privateKey)
    }
    if (getCryptoTypeFromPrivKey(privateKey) === CRYPTO_SM2) {
        return crypto_sm2.privateToAccount(privateKey)
    }
    throw new Error('invalid privateKey')
}

function publicKeyManager (publicKey) {
    if (!isPublicKey(publicKey)) { throw new Error('invalid publicKey') }

    if (getCryptoTypeFromPubKey(publicKey) === CRYPTO_SM2) {
        return crypto_sm2.generateByPub(publicKey)
    }
    if (getCryptoTypeFromPubKey(publicKey) === CRYPTO_ED25519) {
        return generateByPub(publicKey)
    }
    throw new Error('invalid publicKey')
}

function generateByPub (encPublicKey) {
    const encAddress = publicToAddress(encPublicKey)
    const rawPublicKey = parsePublicKey(encPublicKey)
    return {
        encAddress,
        rawPublicKey
    }
}
module.exports = {
    generate,
    getBidAndKeyPairBySM2,
    getBidAndKeyPair,
    privateKeyManager,
    privateKeyManagerByKey,
    publicKeyManager,
    getEncPublicKey,
    getEncPublicKeyByRaw,
    getEncPrivateKeyByRaw,
    parsePrivateKey,
    parsePublicKey,
    isPrivateKey,
    isPublicKey,
    isAddress,
    generateKeyStore,
    decipherKeyStore,
    generateChild,
    privKeyFromMCodeAndCrypto,
    generateMnemonicCode,
    privateKeyFromMnemonicCode,
    sign,
    verify,
    getCryptoTypeFromPrivKey,
    getCryptoTypeFromPubKey
}
module.exports.CRYPTO_SM2 = CRYPTO_SM2
module.exports.CRYPTO_ED25519 = CRYPTO_ED25519
