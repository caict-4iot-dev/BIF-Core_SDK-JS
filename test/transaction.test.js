'use strict'
const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
    host: 'http://test.bifcore.bitfactory.cn'
})

it('test gasSend', async () => {
    let gasSendOperation = {
        sourceAddress: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2',
        privateKey: 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL',
        destAddress: 'did:bid:efYhALrHoHiaVnoZgRgJbCghZZdzkQUh',
        remarks: 'gasSend',
        amount: '100000000',
        ceilLedgerSeq: '',
        feeLimit: '',
        gasPrice: '',
        domainId: '0'
    }
    let data = await sdk.transaction.gasSend(gasSendOperation)
    console.log('gasSend() : ', JSON.stringify(data))
})

it('test getTransactionInfo', async () => {
    let param = {
        hash: '21ef07e8a83f9362184d90bd5933e47b4d12a689090c03f4aca0fdca04f95729',
        domainId: '20'
    }
    let data = await sdk.transaction.getTransactionInfo(param)
    console.log('getTransactionInfo() : ', JSON.stringify(data))
})

it('test evaluateFee', async () => {
    // setMetadata
    let setMetadata = sdk.operaction.accountSetMetadataOperation
    setMetadata.setKey('mykey1')
    setMetadata.setValue('myvalue1')
    setMetadata.setVersion('0')

    // accountCreate
    let accountCreateOperation = sdk.operaction.accountCreateOperation
    accountCreateOperation.setDestAddress('did:bid:efzvTJDj1HnbSwLrynxCCwsEFT8RZJzL')
    accountCreateOperation.setInitBalance(1)

    // accountCreate
    let accountSetPrivilegeOperation = sdk.operaction.accountSetPrivilegeOperation
    let signers = [
        {
            'address': 'did:bid:ef29FfnB21n7wS5U4VY1rCzbo8tjPsJv4',
            'weight': 2
        }
    ]
    let typeThresholds = [
        {
            'type': 1,
            'threshold': 1
        },
        {
            'type': 7,
            'threshold': 2
        }
    ]
    accountSetPrivilegeOperation.setMasterWeight(1)
    accountSetPrivilegeOperation.setSigners(signers)
    accountSetPrivilegeOperation.setTxThreshold(2)
    accountSetPrivilegeOperation.setTypeThresholds(typeThresholds)

    // gasSendOperation
    let gasSendOperation = sdk.operaction.gasSendOperation
    gasSendOperation.setAmount(1000)
    gasSendOperation.setDestAddress('did:bid:efYhALrHoHiaVnoZgRgJbCghZZdzkQUh')

    // contractCreateOperation
    let contractCreateOperation = sdk.operaction.contractCreateOperation
    contractCreateOperation.setPayload("\"use strict\";function init(bar){/*init whatever you want*/return;}function main(input){let para = JSON.parse(input);if (para.do_foo)\n            {\n              let x = {\n                \'hello\' : \'world\'\n              };\n            }\n          }\n          \n          function query(input)\n          { \n            return input;\n          }\n        ",)
    contractCreateOperation.setInitBalance(1)
    contractCreateOperation.setType(1)

    // contractInvokeOperation
    let contractInvokeOperation = sdk.operaction.contractInvokeOperation
    contractInvokeOperation.setContractAddress('did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu')

    let request = {
        sourceAddress: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        privateKey: 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK',
        operations: contractInvokeOperation,
        feeLimit: '',
        gasPrice: '',
        domainId: '20'
    }
    let data = await sdk.transaction.evaluateFee(request)
    console.log('evaluateFee() : ', JSON.stringify(data))
})

it('test BIFSubmit', async () => {
    // 初始化参数
    let serialization = '0a286469643a6269643a65666e5655677151466659657539374142663673476d335746745658485a4232104f22330807522f0a286469643a6269643a65665968414c72486f486961566e6f5a6752674a624367685a5a647a6b5155681080c2d72f2a0767617353656e6430c0843d3864'
    let privateKey = 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL'
    // sign serialization
    let signData = sdk.transaction.signTransSerialization([privateKey]
        , serialization)
    // console.log('signData : ', signData)
    //  submit transaction
    let transactionInfo = await sdk.transaction.submitTrans(
        serialization,
        signData
    )
    console.log('BIFSubmit() : ', JSON.stringify(transactionInfo))
})

/**
 * 获取交易池中交易条数
 */
it('test getTxCacheSize', async () => {
    let data = await sdk.transaction.getTxCacheSize()
    console.log('getTxCacheSize() : ', JSON.stringify(data))
})
