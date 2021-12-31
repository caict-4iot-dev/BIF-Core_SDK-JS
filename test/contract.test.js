'use strict'

const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
     host: 'http://test-bif-core.xinghuo.space'
})
/**
 * 检测合约账户的有效性
 */
it('test checkContractAddress', async () => {
    const contractAddress = 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu'
    let data = await sdk.contract.checkContractAddress(contractAddress)
    console.log('checkContractAddress() : ', JSON.stringify(data))
})

/**
 * 合约创建
 */
it('test createContract', async () => {
    let createContractOperation = {
        sourceAddress: 'did:bid:efHzcjj3w1eg9B4aoaem5axrBLS8y8JF',
        privateKey: 'priSPKk7LBEPdwYARirLfAheRbYTTmKAJJWUpKQgTRMG7cWMay',
        payload: "608060405234801561001057600080fd5b5061013f806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063031153c214610046575b600080fd5b34801561005257600080fd5b5061005b6100d6565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561009b578082015181840152602081019050610080565b50505050905090810190601f1680156100c85780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60606040805190810160405280600b81526020017f68656c6c6f20776f726c640000000000000000000000000000000000000000008152509050905600a165627a7a72305820bc883dfd86fdb2f9784cc8947e4c13628125b0b4dd840f903fb4b40c12ac91010029",
        initBalance: '1',
        remarks: 'create account',
        type: 1,
        feeLimit: '100208801',
        ceilLedgerSeq: '',
        initInput: ''
    }
    let data = await sdk.contract.createContract(createContractOperation)
    console.log('createContract() : ', JSON.stringify(data))
})

/**
 * 根据交易Hash查询合约地址
 */
it('test getContractAddress', async () => {
    const hash = '69677fd576a38b3ed64e4f4bbc80deb4b32ce8cbe00ef1daf467343eac0ee62c'
    let data = await sdk.contract.getContractAddress(hash)
    console.log('getContractAddress() : ', JSON.stringify(data))
})

/**
 * 查询合约代码。
 */
it('test getContractInfo', async () => {
    const contractAddress = 'did:bid:efdzmPKbie68djWpAdyAP8uLY1WtVoXP'
    let data = await sdk.contract.getContractInfo(contractAddress)
    console.log('getContractInfo() : ', JSON.stringify(data))
})

/**
 * 调用合约查询接口。
 */
it('test contractQuery', async () => {
    let contractQueryOperation = {
        sourceAddress: '',
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        input: ''
    }
    let data = await sdk.contract.contractQuery(contractQueryOperation)
    console.log('contractQuery() : ', JSON.stringify(data))
})

/**
 * 调用合约查询接口。
 */
it('test contractInvoke', async () => {
    let contractInvokeOperation = {
        sourceAddress: 'did:bid:efQMuPahc3zm7abBUBfj22xZokhZ7rED',
        privateKey: 'priSPKqSR8vTVJ1y8Wu1skBNWMHPeu8nkaerZNKEzkRq3KJix4',
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        ceilLedgerSeq: '',
        feeLimit: '',
        remarks: 'contractInvoke',
        amount: '1',
        input: ''
    }
    let data = await sdk.contract.contractInvoke(contractInvokeOperation)
    console.log('contractInvoke() : ', JSON.stringify(data))
})
