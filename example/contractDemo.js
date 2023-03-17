'use strict'

const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
     host: 'http://test.bifcore.bitfactory.cn'
})
/**
 * 检测合约账户的有效性
 */
it('test checkContractAddress', async () => {
    let param = {
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        domainId: '20'
    }
    let data = await sdk.contract.checkContractAddress(param)
    console.log('checkContractAddress() : ', JSON.stringify(data))
})

/**
 * 合约创建
 */
it('test createContract', async () => {
    let createContractOperation = {
        sourceAddress: 'did:bid:efQMuPahc3zm7abBUBfj22xZokhZ7rED',
        privateKey: 'priSPKqSR8vTVJ1y8Wu1skBNWMHPeu8nkaerZNKEzkRq3KJix4',
        payload: "\"use strict\";function init(bar){/*init whatever you want*/return;}function main(input){let para = JSON.parse(input);if (para.do_foo)\n            {\n              let x = {\n                \'hello\' : \'world\'\n              };\n            }\n          }\n          \n          function query(input)\n          { \n            return input;\n          }\n        ",
        initBalance: '1',
        remarks: 'create account',
        type: 0,
        feeLimit: '100100000',
        ceilLedgerSeq: '',
        initInput: '',
        domainId: '20'
    }
    let data = await sdk.contract.createContract(createContractOperation)
    console.log('createContract() : ', JSON.stringify(data))
})

/**
 * 根据交易Hash查询合约地址
 */
it('test getContractAddress', async () => {
    let param = {
        hash: '59228dfa8fcd1e65b918dbe30096302f3a4b136d2762200029ed397496f96ada',
        domainId: '20'
    }
    let data = await sdk.contract.getContractAddress(param)
    console.log('getContractAddress() : ', JSON.stringify(data))
})

/**
 * 查询合约代码。
 */
it('test getContractInfo', async () => {
    let param = {
        contractAddress: 'did:bid:efdzmPKbie68djWpAdyAP8uLY1WtVoXP',
        domainId: '20'
    }
    let data = await sdk.contract.getContractInfo(param)
    console.log('getContractInfo() : ', JSON.stringify(data))
})

/**
 * 调用合约查询接口。
 */
it('test contractQuery', async () => {
    let contractQueryOperation = {
        sourceAddress: '',
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        input: '',
        domainId: '20'
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
        input: '',
        domainId: '20'
    }
    let data = await sdk.contract.contractInvoke(contractInvokeOperation)
    console.log('contractInvoke() : ', JSON.stringify(data))
})
