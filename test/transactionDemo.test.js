'use strict'

const BIFCoreSDK = require('../index')
const BigNumber = require('bignumber.js')


it('test operation.setMetadatas()', async() => {
    for(var i=0;i<3;i++){
        const sdk = new BIFCoreSDK({
            host: 'http://test.bifcore.bitfactory.cn'
        })
        const privateKey = 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK'
        const sourceAddress = 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB'
        let feeLimit = 1000000
        let gasPrice = 10

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

        let setMetadatas = {
            key: '20220627'+i,
            value: 'metadata-20220623',
            version: '1'
        }
        sdk.transaction.addOperation('setMetadata', setMetadatas)
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
        if (transactionInfo.results[0].error_code === 0) {
            let params = {
                hash: transactionInfo.results[0].hash,
                domainId: '0'
            }
            let data = await sdk.transaction.getTransactionInfo(params)
            if (data.error_code === 0) {
                console.log('transactionInfo1 : ', JSON.stringify(data))
            }else{
                setTimeout(function() {
                    callback(null);
                }, 5000);
                data = await sdk.transaction.getTransactionInfo(params)
                console.log('transactionInfo2 : ', JSON.stringify(data))
            }
        }

    }
},50000)
