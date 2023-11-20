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
    setMetadata.setVersion('1')
    setMetadata.setDeleteFlag(true)

    // accountCreate
    let accountCreateOperation = sdk.operaction.accountCreateOperation
    accountCreateOperation.setDestAddress(sdk.keypair.getBidAndKeyPair().encAddress)
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
        sourceAddress: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2',
        privateKey: 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL',
        operations: contractInvokeOperation,
        feeLimit: '20',
        gasPrice: '2',
        domainId: '20'
    }
    let data = await sdk.transaction.evaluateFee(request)
    console.log('evaluateFee() : ', JSON.stringify(data))
})

/**
 * 批量费用评估
 */
it('test batchEvaluateFee', async () => {
    let amount = '0'
    const destAddress1 = sdk.keypair.getBidAndKeyPairBySM2().encAddress
    const destAddress2 = sdk.keypair.getBidAndKeyPairBySM2().encAddress
    let input1 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress1 + '", "version": "1"}}}'
    let input2 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress2 + '", "version": "1"}}}'

    let operations = []
    let contractInvokeOperation1 = {
        contractAddress: destAddress1,
        amount: amount,
        input: input1
    }
    let contractInvokeOperation2 = {
        contractAddress: destAddress2,
        amount: amount,
        input: input2
    }
    operations.push(contractInvokeOperation1)
    operations.push(contractInvokeOperation2)

    let request = {
        sourceAddress: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2',
        privateKey: 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL',
        operations: operations,
        feeLimit: '20',
        gasPrice: '1',
        domainId: '0'
    }
    let data = await sdk.transaction.batchEvaluateFee(request)
    console.log('batchEvaluateFee() : ', JSON.stringify(data))
})

it('test BIFSubmit', async () => {
    // 初始化参数
    let serialization = '0a286469643a6269643a65666e5655677151466659657539374142663673476d335746745658485a4232104f22330807522f0a286469643a6269643a65665968414c72486f486961566e6f5a6752674a624367685a5a647a6b5155681080c2d72f2a0767617353656e6430c0843d3864'
    let privateKey = 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL'
    let privateKey1 = 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK'
    // sign serialization
    let signatures = sdk.transaction.signTransSerialization([privateKey, privateKey1]
        , serialization)
    let request = {
        serialization: serialization,
        signatures: signatures
    }
    // submit transaction
    let transactionInfo = await sdk.transaction.BIFSubmit(request)
    console.log('BIFSubmit() : ', JSON.stringify(transactionInfo))
})

/**
 * 获取交易池中交易条数
 */
it('test getTxCacheSize', async () => {
    let domainId = '21'
    let data = await sdk.transaction.getTxCacheSize(domainId)
    console.log('getTxCacheSize() : ', JSON.stringify(data))
})

/**
 * 获取交易池中交易数据
 */
it('test getTxCacheData', async () => {
    let request = {
        domainId: '20',
        hash: ''
    }
    let data = await sdk.transaction.getTxCacheData(request)
    console.log('getTxCacheData() : ', JSON.stringify(data))
})

/**
 * 离线blob数据解析
 */
it('test parseBlob', async () => {
    let transactionBlob = '0a286469643a6269643a65666e5655677151466659657539374142663673476d335746745658485a4232100d228a03080122850312f80212f5022275736520737472696374223b66756e6374696f6e20717565727942616e616e63652861646472657373290d0a7b72657475726e20222074657374207175657279207072697661746520636f6e7472616374223b7d0d0a66756e6374696f6e2063726561746528696e707574290d0a7b6c6574206b6579203d2022707269766174655f74785f222b696e7075742e69643b6c65742076616c7565203d2022736574207072697661746520696420222b696e7075742e69643b436861696e2e73746f7265286b65792c76616c7565293b7d0d0a66756e6374696f6e20696e697428696e707574290d0a7b72657475726e3b7d0d0a66756e6374696f6e206d61696e28696e707574290d0a7b72657475726e3b7d0d0a66756e6374696f6e20717565727928696e707574290d0a7b6c6574206b6579203d2022707269766174655f74785f222b696e7075742e69643b6c65742064617461203d20436861696e2e6c6f6164286b6579293b72657475726e20646174613b7d1a041a02080128a08d062a080123456789abcdef30c0843d38016014'
    let data = await sdk.transaction.parseBlob(transactionBlob)
    console.log('parseBlob() : ', JSON.stringify(data))
})

it('test batchGasSend', async () => {
    let senderAddress = 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2'
    let senderPrivateKey = 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL'
    let amount = '0'
    const destAddress1 = sdk.keypair.getBidAndKeyPair().encAddress
    const destAddress2 = sdk.keypair.getBidAndKeyPair().encAddress

    let operations = []
    let gasSendOperation1 = {
        destAddress: destAddress1,
        amount: amount
    }
    let gasSendOperation2 = {
        destAddress: destAddress2,
        amount: amount
    }
    operations.push(gasSendOperation1)
    operations.push(gasSendOperation2)

    let gasSendRequestOperation = sdk.operaction.gasSendRequestOperation
    gasSendRequestOperation.setSenderAddress(senderAddress)
    gasSendRequestOperation.setPrivateKey(senderPrivateKey)
    gasSendRequestOperation.setRemarks('gas send')
    gasSendRequestOperation.setDomainId('0')
    gasSendRequestOperation.setCeilLedgerSeq('')
    gasSendRequestOperation.setOperations(operations)
    let data = await sdk.transaction.batchGasSend(gasSendRequestOperation)
    console.log('batchGasSend() : ', JSON.stringify(data))
})

