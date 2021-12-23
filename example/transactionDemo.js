'use strict'
const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
     host: 'http://test-bif-core.xinghuo.space'
})

it('test gasSend', async () => {
    let gasSendOperation = {
        sourceAddress: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2',
        privateKey: 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL',
        destAddress: 'did:bid:efYhALrHoHiaVnoZgRgJbCghZZdzkQUh',
        remarks: 'gasSend',
        amount: '100000000',
        ceilLedgerSeq: ''
    }
    let data = await sdk.transaction.gasSend(gasSendOperation)
    console.log('gasSend() : ', JSON.stringify(data))
})
it('test privateContractCreate', async () => {
    let privateContractCreateOperation = {
        sourceAddress: 'did:bid:efYhALrHoHiaVnoZgRgJbCghZZdzkQUh',
        privateKey: 'priSPKfLa4oEQS3ieXGeYyF8Nm9iSkWybkJbnkfyAUQnhaUoCd',
        type: 1,
        remarks: 'gasSend',
        ceilLedgerSeq: '',
        payload: '\"use strict\";function queryBanance(address)\r\n{return \" test query private contract sdk_3\";}\r\nfunction sendTx(to,amount)\r\n{return Chain.payCoin(to,amount);}\r\nfunction init(input)\r\n{return;}\r\nfunction main(input)\r\n{let args=JSON.parse(input);if(args.method===\"sendTx\"){return sendTx(args.params.address,args.params.amount);}}\r\nfunction query(input)\r\n{let args=JSON.parse(input);if(args.method===\"queryBanance\"){return queryBanance(args.params.address);}}',
        from: 'bDRE8iIfGdwDeQOcJqZabZQH5Nd6cfTOMOorudtgXjQ=',
        to: ['bwPdcwfUEtSZnaDmi2Nvj9HTwOcRvCRDh0cRdvX9BFw=']
    }
    let data = await sdk.transaction.privateContractCreate(privateContractCreateOperation)
    // var hash = 'dfeb77cc0c4dfdf209e6ee40878be8bf72d70caf0cd7cbc8ef7ae1452930bdf6'
    console.log('privateContractCreate() : ', JSON.stringify(data))
})

it('test privateContractCall', async () => {
    let privateContractCreateOperation = {
        sourceAddress: 'did:bid:efYhALrHoHiaVnoZgRgJbCghZZdzkQUh',
        privateKey: 'priSPKfLa4oEQS3ieXGeYyF8Nm9iSkWybkJbnkfyAUQnhaUoCd',
        destAddress: 'did:bid:efGSDpr4Fo4TEnHx1kBBSgSAfTt85kY6',
        type: 1,
        remarks: 'private Contract Call',
        ceilLedgerSeq: '',
        input: '{\"method\":\"queryBanance\",\"params\":{\"address\":\"567890哈哈=======\"}}',
        from: 'bDRE8iIfGdwDeQOcJqZabZQH5Nd6cfTOMOorudtgXjQ=',
        to: ['bwPdcwfUEtSZnaDmi2Nvj9HTwOcRvCRDh0cRdvX9BFw=']
    }
    let data = await sdk.transaction.privateContractCall(privateContractCreateOperation)
    // const hash = '0390905e5970f1bf262b37fc11d7b2b4b5e28d9a33006584c4940c60fd283518'
    console.log('privateContractCall() : ', JSON.stringify(data))
})

it('test getTransactionInfo', async () => {
    const hash = 'f522df79463cdae460e51a68556f1b7107cddd8ff77dca64a25b81555e2a1c1f'
    let data = await sdk.transaction.getTransactionInfo(hash)
    console.log('getTransactionInfo() : ', JSON.stringify(data))
})

it('test evaluateFee', async () => {
    let operationList = [
        {
            'set_metadata': {
                'key': 'mykey1',
                'value': 'myvalue1',
                'version': 0
            },
            'type': 4
        }
    ]
    let info = {
        items: [
            {
                private_keys: [
                    'priSPKUudyVAi5WrhHJU1vCJZYyBL5DNd36MPhbYgHuDPz5E7r'
                ],
                transaction_json: {
                    fee_limit: '1000000',
                    gas_price: '1',
                    source_address: 'did:bid:efAsXt5zM2Hsq6wCYRMZBS5Q9HvG2EmK',
                    nonce: '29',
                    operations: operationList
                },
                signature_number: 1
            }
        ]
    }
    let data = await sdk.transaction.evaluateFee(info)
    console.log('evaluateFee() : ', JSON.stringify(data))
})

it('test BIFSubmit', async () => {
    // 初始化参数
    let serialization = 'sss'
    let privateKey = 'priSPKqYp19ghxeCykHUrepLRkCRD3a2a9y5MJGF8Kc4qfn2aK'
    // sign blob
    let signData = sdk.transaction.signTransSerialization([privateKey]
        , serialization)
    console.log('signData : ', signData)
    //  submit transaction
    let transactionInfo = await sdk.transaction.submitTrans({
        serialization,
        signature: signData
    })
    console.log('BIFSubmit() : ', JSON.stringify(transactionInfo))
})
