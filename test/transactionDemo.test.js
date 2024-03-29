'use strict'

const BIFCoreSDK = require('../index')
const BigNumber = require('bignumber.js')
const sdk = new BIFCoreSDK({
    host: 'http://test.bifcore.bitfactory.cn'
})

it('test operation.contractInvoke()', async() => {
    const privateKey = 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK'
    const sourceAddress = 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB'
    const contractAddress = 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu'
    let feeLimit = 1000000
    let gasPrice = 10
    let amount = 1
    let input = ''
    // =============================
    //  1、Get nonce
    // =============================

    let param = {
        address: sourceAddress,
        domainId: '0'
    }
    const result = await sdk.account.getNonce(param)
    if (result.errorCode !== 0) {
        console.log(result)
        return
    }
    let nonce = result.result.nonce
    nonce = new BigNumber(nonce).plus(1).toString(10)
    // =============================
    // 2、build operation
    // =============================
    let contractInvoke = {
        to: contractAddress,
        amount: amount,
        input: input
    }

    let operations = [contractInvoke]
    sdk.transaction.addOperation('payCoin', operations)

    // =============================
    // 3、blob
    // ============================
    let tranactionParameter = {
        sourceAddress: sourceAddress,
        nonce: nonce,
        feeLimit: feeLimit,
        gasPrice: gasPrice,
        metadata: 'setmeta',
        domainId: '0'
    }
    sdk.transaction.buildTransaction(tranactionParameter)

    let blob = sdk.transaction.blob
    console.log(sdk.transaction.blob)
    // =============================
    // 4、sign
    // ============================
    let privateKeyArray = [privateKey]
    let signData = sdk.transaction.signTransSerialization(privateKeyArray
        , blob)
     console.log('signData : ', signData)

    // =============================
    // 5、submitTransaction
    // ============================
    let transactionInfo = await sdk.transaction.submitTrans(
        blob,
        signData
    )
    console.log('BIFSubmit() : ', JSON.stringify(transactionInfo))
})
