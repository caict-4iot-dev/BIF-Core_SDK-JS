'use strict'
const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
    host: 'http://test.bifcore.bitfactory.cn'
})

it('test gasSend', async () => {
    let gasSendOperation = {
        sourceAddress: 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5',
        privateKey: 'priSPKkLzxxmGehL534YiXsov9xF8ssioBWuM3xiubDqTERZiE',
        destAddress: 'did:bid:efYhALrHoHiaVnoZgRgJbCghZZdzkQUh',
        remarks: 'gasSend',
        amount: '100000000',
        ceilLedgerSeq: '',
        feeLimit: '',
        gasPrice: ''
    }
    let data = await sdk.transaction.gasSend(gasSendOperation)
    console.log('gasSend() : ', JSON.stringify(data))
})
it('test privateContractCreate', async () => {
    let privateContractCreateOperation = {
        sourceAddress: 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5',
        privateKey: 'priSPKkLzxxmGehL534YiXsov9xF8ssioBWuM3xiubDqTERZiE',
        type: 1,
        remarks: 'gasSend',
        ceilLedgerSeq: '',
        payload: '\"use strict\";function queryBanance(address)\r\n{return \" test query private contract sdk_3\";}\r\nfunction sendTx(to,amount)\r\n{return Chain.payCoin(to,amount);}\r\nfunction init(input)\r\n{return;}\r\nfunction main(input)\r\n{let args=JSON.parse(input);if(args.method===\"sendTx\"){return sendTx(args.params.address,args.params.amount);}}\r\nfunction query(input)\r\n{let args=JSON.parse(input);if(args.method===\"queryBanance\"){return queryBanance(args.params.address);}}',
        from: 'sX46dMvKzKgH/SByjBs0uCROD9paCc/tF6WwcgUx3nA=',
        to: ['Pz8tQqi4DZcL5Vrh/GXS20vZ4oqaiNyFxG0B9xAJmhw='],
        feeLimit: '',
        gasPrice: ''
    }
    let data = await sdk.transaction.privateContractCreate(privateContractCreateOperation)
    // var hash = '08ddd2deccfc316b961ce8a667a758844291ed7c43ae6be3ce14b9e0bb22b7db'
    console.log('privateContractCreate() : ', JSON.stringify(data))
})

it('test privateContractCall', async () => {
    let privateContractCreateOperation = {
        sourceAddress: 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5',
        privateKey: 'priSPKkLzxxmGehL534YiXsov9xF8ssioBWuM3xiubDqTERZiE',
        destAddress: 'did:bid:ef2sdQ3kxTHrgB6kpvRDDvCG9NeGW1CX',
        type: 1,
        remarks: 'private Contract Call',
        ceilLedgerSeq: '',
        input: '\"use strict\";function queryBanance(address)\r\n{return \" test query private contract sdk_3\";}\r\nfunction sendTx(to,amount)\r\n{return Chain.payCoin(to,amount);}\r\nfunction init(input)\r\n{return;}\r\nfunction main(input)\r\n{let args=JSON.parse(input);if(args.method===\"sendTx\"){return sendTx(args.params.address,args.params.amount);}}\r\nfunction query(input)\r\n{let args=JSON.parse(input);if(args.method===\"queryBanance\"){return queryBanance(args.params.address);}}',
        from: 'sX46dMvKzKgH/SByjBs0uCROD9paCc/tF6WwcgUx3nA=',
        to: ['Pz8tQqi4DZcL5Vrh/GXS20vZ4oqaiNyFxG0B9xAJmhw='],
        feeLimit: '',
        gasPrice: ''
    }

    let data = await sdk.transaction.privateContractCall(privateContractCreateOperation)
    console.log('privateContractCall() : ', JSON.stringify(data))
})

it('test getTransactionInfo', async () => {
    const hash = '21ef07e8a83f9362184d90bd5933e47b4d12a689090c03f4aca0fdca04f95729'
    let data = await sdk.transaction.getTransactionInfo(hash)
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

    // privateContractCreateOperation
    let privateContractCreateOperation = sdk.operaction.privateContractCreateOperation
    privateContractCreateOperation.setType(0)
    privateContractCreateOperation.setFrom('bDRE8iIfGdwDeQOcJqZabZQH5Nd6cfTOMOorudtgXjQ=')
    privateContractCreateOperation.setTo(['bwPdcwfUEtSZnaDmi2Nvj9HTwOcRvCRDh0cRdvX9BFw='])
    privateContractCreateOperation.setPayload('\"use strict\";function queryBanance(address)\r\n{return \" test query private contract sdk_3\";}\r\nfunction sendTx(to,amount)\r\n{return Chain.payCoin(to,amount);}\r\nfunction init(input)\r\n{return;}\r\nfunction main(input)\r\n{let args=JSON.parse(input);if(args.method===\"sendTx\"){return sendTx(args.params.address,args.params.amount);}}\r\nfunction query(input)\r\n{let args=JSON.parse(input);if(args.method===\"queryBanance\"){return queryBanance(args.params.address);}}')

    // privateContractCreateOperation
    let privateContractCallOperation = sdk.operaction.privateContractCallOperation
    privateContractCallOperation.setType(0)
    privateContractCallOperation.setFrom('sX46dMvKzKgH/SByjBs0uCROD9paCc/tF6WwcgUx3nA=')
    privateContractCallOperation.setTo(['Pz8tQqi4DZcL5Vrh/GXS20vZ4oqaiNyFxG0B9xAJmhw='])
    privateContractCallOperation.setDestAddress('did:bid:ef2sdQ3kxTHrgB6kpvRDDvCG9NeGW1CX')
    privateContractCallOperation.setInput('{\"method\":\"queryBanance\",\"params\":{\"address\":\"567890哈哈=======\"}}')

    let request = {
        sourceAddress: 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5',
        privateKey: 'priSPKkLzxxmGehL534YiXsov9xF8ssioBWuM3xiubDqTERZiE',
        operations: privateContractCallOperation,
        feeLimit: '',
        gasPrice: ''
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
