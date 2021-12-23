'use strict'

const keypair = require('../lib/keypair')
const randombytes = require('randombytes')

it('test getBidAndKeyPair()', async () => {
    const KeyPairEntity = keypair.getBidAndKeyPair()
    const encAddress = KeyPairEntity.encAddress
    const encPublicKey = KeyPairEntity.encPublicKey
    const encPrivateKey = KeyPairEntity.encPrivateKey
    const rawPublicKey = KeyPairEntity.rawPublicKey
    const rawPrivateKey = KeyPairEntity.rawPrivateKey
    console.log('getBidAndKeyPair()', rawPublicKey)
    console.log('getBidAndKeyPair()', JSON.stringify(KeyPairEntity))
    console.log('encAddress', encAddress)
    console.log('encPublicKey', encPublicKey)
    console.log('encPrivateKey', encPrivateKey)
    console.log('rawPrivateKey', rawPrivateKey)
})

it('test getBidAndKeyPairBySM2()', async () => {
    const KeyPairEntitySM2 = await keypair.getBidAndKeyPairBySM2()
    const encAddress = KeyPairEntitySM2.encAddress
    const encPublicKey = KeyPairEntitySM2.encPublicKey
    const encPrivateKey = KeyPairEntitySM2.encPrivateKey
    const rawPublicKey = KeyPairEntitySM2.rawPublicKey
    const rawPrivateKey = KeyPairEntitySM2.rawPrivateKey
    console.log('getBidAndKeyPair()', encAddress)
    console.log('getBidAndKeyPairBySM2()', JSON.stringify(KeyPairEntitySM2))
    console.log('encPublicKey', encPublicKey)
    console.log('encPrivateKey', encPrivateKey)
    console.log('rawPublicKey', rawPublicKey)
    console.log('rawPrivateKey', rawPrivateKey)

})

it('test ED25519', async () => {
    // 私钥对象
    const privateKeyManager = await keypair.privateKeyManager(keypair.CRYPTO_ED25519)
    console.log('privateKeyManager()', privateKeyManager)
    console.log('privateKeyManager()', JSON.stringify(privateKeyManager))
    // 私钥转对象
    const privateKeyManagerByKey = await keypair.privateKeyManagerByKey(privateKeyManager.encPrivateKey)
    console.log('privateKeyManagerByKey ', JSON.stringify(privateKeyManagerByKey))

    // 根据私钥获取公钥
    const encPublicKey = await keypair.getEncPublicKey(privateKeyManager.encPrivateKey)
    console.log('encPublicKey ', JSON.stringify(encPublicKey))
    // 原生私钥转星火私钥
    const encPrivateKeyByRaw = await keypair.getEncPrivateKeyByRaw(privateKeyManager.rawPrivateKey, keypair.CRYPTO_ED25519)
    console.log('encPrivateKeyByRaw ', JSON.stringify(encPrivateKeyByRaw))
    // 原生公钥转星火公钥
    const encPublicKeyByRaw = await keypair.getEncPublicKeyByRaw(privateKeyManager.rawPublicKey, keypair.CRYPTO_ED25519)
    console.log('encPublicKey ', JSON.stringify(encPublicKeyByRaw))

    // 签名
    const blod = 'test'
    const signature = await keypair.sign(blod, privateKeyManager.encPrivateKey)
    console.log('signature ', signature)
    // 验签
    const verify = await keypair.verify(blod, signature, privateKeyManager.encPublicKey)
    console.log('verify ', verify)

    // 公钥对象
    const publicKeyManager = await keypair.publicKeyManager(privateKeyManager.encPublicKey)
    console.log('privateKeyManager()', JSON.stringify(publicKeyManager))
})

it('test SM2', async () => {
    // 私钥对象
    const privateKeyManager = await keypair.privateKeyManager(keypair.CRYPTO_SM2)
    console.log('privateKeyManager()', JSON.stringify(privateKeyManager))
    // 私钥转对象
    const privateKeyManagerByKey = await keypair.privateKeyManagerByKey(privateKeyManager.encPrivateKey)
    console.log('privateKeyManagerByKey ', JSON.stringify(privateKeyManagerByKey))

    // 根据私钥获取公钥
    const encPublicKey = await keypair.getEncPublicKey(privateKeyManager.encPrivateKey)
    console.log('encPublicKey ', JSON.stringify(encPublicKey))
    // 原生私钥转星火私钥
    const encPrivateKeyByRaw = await keypair.getEncPrivateKeyByRaw(privateKeyManager.rawPrivateKey, keypair.CRYPTO_SM2)
    console.log('encPrivateKeyByRaw ', JSON.stringify(encPrivateKeyByRaw))
    // 原生公钥转星火公钥
    const encPublicKeyByRaw = await keypair.getEncPublicKeyByRaw(privateKeyManager.rawPublicKey, keypair.CRYPTO_SM2)
    console.log('encPublicKey ', JSON.stringify(encPublicKeyByRaw))

    // 签名
    const blod = 'test'
    const signature = await keypair.sign(blod, privateKeyManager.encPrivateKey)
    console.log('signature ', signature)
    // 验签
    const verify = await keypair.verify(blod, signature, privateKeyManager.encPublicKey)
    console.log('verify ', verify)

    // 公钥对象
    const publicKeyManager = await keypair.publicKeyManager(privateKeyManager.encPublicKey)
    console.log('privateKeyManager()', JSON.stringify(publicKeyManager))
})

it('test keyStoreWithPrivateKey()', async () => {
    const encPrivateKey = 'priSrrstxpMCKMa9G6d41rZ4iwzKbGeqJrXqeWZYXVo2pct24L'
    const password = 'bif8888'
    // 生成密钥存储器
    const keyStore = keypair.generateKeyStore(encPrivateKey, password)
    console.log('generateKeyStore()', JSON.stringify(keyStore))

    // 解析密钥存储器
    const privateKey = keypair.decipherKeyStore(keyStore, password)
    console.log('decipherKeyStore()', JSON.stringify(privateKey))
})

it('test mnemonic()', async () => {
    let random = randombytes(16)
    // console.log(entropy.toString('hex'))
    const mcode = keypair.generateMnemonicCode(random.toString('hex'))

    console.log('mcode ', mcode)
    // ED25519
    const privkey = keypair.privKeyFromMCodeAndCrypto(keypair.CRYPTO_ED25519, mcode, "m/44'/526'/1'/0/0")
    console.log(privkey)
    // SM2
    const privkeySM2 = keypair.privKeyFromMCodeAndCrypto(keypair.CRYPTO_SM2, mcode, "m/44'/526'/1'/0/0")
    console.log(privkeySM2)

    const privateKey = await keypair.privateKeyFromMnemonicCode(mcode, "m/44'/526'/1'/0/0")
    console.log(privateKey)

})
