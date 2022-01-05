'use strict'
const randombytes = require('randombytes')
const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
    host: 'http://test-bif-core.xinghuo.space'
})
it('test getBidAndKeyPair()', async () => {
    const KeyPairEntity = sdk.keypair.getBidAndKeyPair()
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
    const KeyPairEntitySM2 =  sdk.keypair.getBidAndKeyPairBySM2()
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
    const privateKeyManager = await sdk.keypair.privateKeyManager(sdk.keypair.CRYPTO_ED25519)
    console.log('privateKeyManager()', privateKeyManager)
    console.log('privateKeyManager()', JSON.stringify(privateKeyManager))
    // 私钥转对象
    const privateKeyManagerByKey = await sdk.keypair.privateKeyManagerByKey(privateKeyManager.encPrivateKey)
    console.log('privateKeyManagerByKey ', JSON.stringify(privateKeyManagerByKey))

    // 根据私钥获取公钥
    const encPublicKey = await sdk.keypair.getEncPublicKey(privateKeyManager.encPrivateKey)
    console.log('encPublicKey ', JSON.stringify(encPublicKey))
    // 原生私钥转星火私钥
    const encPrivateKeyByRaw = await sdk.keypair.getEncPrivateKeyByRaw(privateKeyManager.rawPrivateKey, sdk.keypair.CRYPTO_ED25519)
    console.log('encPrivateKeyByRaw ', JSON.stringify(encPrivateKeyByRaw))
    // 原生公钥转星火公钥
    const encPublicKeyByRaw = await sdk.keypair.getEncPublicKeyByRaw(privateKeyManager.rawPublicKey, sdk.keypair.CRYPTO_ED25519)
    console.log('encPublicKey ', JSON.stringify(encPublicKeyByRaw))

    // 签名
    const blod = 'test'
    const signature = await sdk.keypair.sign(blod, privateKeyManager.encPrivateKey)
    console.log('signature ', signature)
    // 验签
    const verify = await sdk.keypair.verify(blod, signature, privateKeyManager.encPublicKey)
    console.log('verify ', verify)

    // 公钥对象
    const publicKeyManager = await sdk.keypair.publicKeyManager(privateKeyManager.encPublicKey)
    console.log('privateKeyManager()', JSON.stringify(publicKeyManager))

    const isAddress = await sdk.keypair.isAddress(privateKeyManager.encAddress)
    console.log('isAddress ', isAddress)
})

it('test SM2', async () => {
    // 私钥对象
    const privateKeyManager = await sdk.keypair.privateKeyManager(sdk.keypair.CRYPTO_SM2)
    console.log('privateKeyManager()', JSON.stringify(privateKeyManager))
    // 私钥转对象
    const privateKeyManagerByKey = await sdk.keypair.privateKeyManagerByKey(privateKeyManager.encPrivateKey)
    console.log('privateKeyManagerByKey ', JSON.stringify(privateKeyManagerByKey))

    // 根据私钥获取公钥
    const encPublicKey = await sdk.keypair.getEncPublicKey(privateKeyManager.encPrivateKey)
    console.log('encPublicKey ', JSON.stringify(encPublicKey))
    // 原生私钥转星火私钥
    const encPrivateKeyByRaw = await sdk.keypair.getEncPrivateKeyByRaw(privateKeyManager.rawPrivateKey, sdk.keypair.CRYPTO_SM2)
    console.log('encPrivateKeyByRaw ', JSON.stringify(encPrivateKeyByRaw))
    // 原生公钥转星火公钥
    const encPublicKeyByRaw = await sdk.keypair.getEncPublicKeyByRaw(privateKeyManager.rawPublicKey, sdk.keypair.CRYPTO_SM2)
    console.log('encPublicKey ', JSON.stringify(encPublicKeyByRaw))

    // 签名
    const blod = 'test'
    const signature = await sdk.keypair.sign(blod, privateKeyManager.encPrivateKey)
    console.log('signature ', signature)
    // 验签
    const verify = await sdk.keypair.verify(blod, signature, privateKeyManager.encPublicKey)
    console.log('verify ', verify)

    // 公钥对象
    const publicKeyManager = await sdk.keypair.publicKeyManager(privateKeyManager.encPublicKey)
    console.log('privateKeyManager()', JSON.stringify(publicKeyManager))
})

it('test keyStoreWithPrivateKey()', async () => {
    const encPrivateKey = 'priSrrstxpMCKMa9G6d41rZ4iwzKbGeqJrXqeWZYXVo2pct24L'
    const password = 'bif8888'
    // 生成密钥存储器
    const keyStore = sdk.keypair.generateKeyStore(encPrivateKey, password)
    console.log('generateKeyStore()', JSON.stringify(keyStore))

    // 解析密钥存储器
    const privateKey = sdk.keypair.decipherKeyStore('{\"cypher_text\":\"f306394e808cb422f5c0ad072f09283a4cee1fc8058ab2593397da1d375becdab05b886703d28e802353d5a659b3484f0103\",\"aesctr_iv\":\"9a1c9811fc29cfbe0b6e2160b2f7dc81\",\"scrypt_params\":{\"n\":16384,\"p\":1,\"r\":8,\"salt\":\"80454456c43bb0ed2103b990f549c15262d354cdb49a8682af1d4f618c112b9c\"},\"version\":2}', password)
    console.log('decipherKeyStore()', JSON.stringify(privateKey))
})

it('test mnemonic()', async () => {
    let random = randombytes(16)
    // console.log(entropy.toString('hex'))
    const mcode = sdk.keypair.generateMnemonicCode(random.toString('hex'))

    console.log('mcode ', mcode)
    // ED25519
    const privkey = sdk.keypair.privKeyFromMCodeAndCrypto(sdk.keypair.CRYPTO_ED25519, mcode, "m/44'/526'/1'/0/0")
    console.log(privkey)
    // SM2
    const privkeySM2 = sdk.keypair.privKeyFromMCodeAndCrypto(sdk.keypair.CRYPTO_SM2, mcode, "m/44'/526'/1'/0/0")
    console.log(privkeySM2)

    const privateKey = await sdk.keypair.privateKeyFromMnemonicCode(mcode, "m/44'/526'/1'/0/0")
    console.log(privateKey)

})
