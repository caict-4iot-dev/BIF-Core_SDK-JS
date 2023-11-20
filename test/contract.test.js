'use strict'
const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
    host: 'http://test.bifcore.bitfactory.cn'
})
const ContractInvokeOperation = require('../lib/operation/contractInvokeOperation')
/**
 * 检测合约账户的有效性
 */
it('test checkContractAddress', async () => {
    let param = {
        contractAddress: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2'
        // domainId: '20'
    }
    let data = await sdk.contract.checkContractAddress(param)
    console.log('checkContractAddress() : ', JSON.stringify(data))
})

/**
 * 合约创建
 */
it('test createContract', async () => {
    let createContractOperation = {
        sourceAddress: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        privateKey: 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK',
        payload: '608060405234801561001057600080fd5b5061013f806100206000396000f300608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063031153c214610046575b600080fd5b34801561005257600080fd5b5061005b6100d6565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561009b578082015181840152602081019050610080565b50505050905090810190601f1680156100c85780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60606040805190810160405280600b81526020017f68656c6c6f20776f726c640000000000000000000000000000000000000000008152509050905600a165627a7a72305820bc883dfd86fdb2f9784cc8947e4c13628125b0b4dd840f903fb4b40c12ac91010029',
        initBalance: '1',
        remarks: 'create account',
        type: '1',
        feeLimit: '100107900',
        gasPrice: '',
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
        hash: '9808eb68bb2c84867c32cfb23d0c25c325b4f2e6058723ef72a239aafb34f60f',
        domainId: '0'
    }
    let data = await sdk.contract.getContractAddress(param)
    console.log('getContractAddress() : ', JSON.stringify(data))
})

/**
 * 查询合约代码。
 */
it('test getContractInfo', async () => {
    let param = {
        contractAddress: 'did:bid:efRH1Lbsuqwc6jRw3hK4H5Hp2RhHnryS',
        domainId: '22'
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
        feeLimit: '',
        gasPrice: '',
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
        sourceAddress: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        privateKey: 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK',
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        ceilLedgerSeq: '',
        feeLimit: '',
        gasPrice: '',
        remarks: 'contractInvoke',
        amount: '1',
        input: '',
        domainId: '20'
    }
    let data = await sdk.contract.contractInvoke(contractInvokeOperation)
    console.log('contractInvoke() : ', JSON.stringify(data))
})

/**
 * 用于批量合约调用。
 */
it('test batchContractInvoke', async () => {
    let senderAddress = 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB'
    let senderPrivateKey = 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK'
    let contractAddress = 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu'

    let amount = '0'
    const KeyPairEntity = sdk.keypair.getBidAndKeyPair()
    const destAddress1 = KeyPairEntity.encAddress
    const destAddress2 = KeyPairEntity.encAddress
    let input1 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress1 + '", "version": "1"}}}'
    let input2 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress2 + '", "version": "1"}}}'

    let contractInvokeOperation1 = new ContractInvokeOperation()
    contractInvokeOperation1.setContractAddress(contractAddress)
    contractInvokeOperation1.setAmount(amount)
    contractInvokeOperation1.setInput(input1)
    let contractInvokeOperation2 = new ContractInvokeOperation()
    contractInvokeOperation2.setContractAddress(contractAddress)
    contractInvokeOperation2.setAmount(amount)
    contractInvokeOperation2.setInput(input2)

    let operations = []
    operations.push(contractInvokeOperation1)
    operations.push(contractInvokeOperation2)

    let contractInvokeRequestOperation = sdk.operaction.contractInvokeRequestOperation
    contractInvokeRequestOperation.setSenderAddress(senderAddress)
    contractInvokeRequestOperation.setPrivateKey(senderPrivateKey)
    contractInvokeRequestOperation.setRemarks('contract invoke')
    contractInvokeRequestOperation.setDomainId('0')
    contractInvokeRequestOperation.setCeilLedgerSeq('')
    contractInvokeRequestOperation.setOperations(operations)
    let data = await sdk.contract.batchContractInvoke(contractInvokeRequestOperation)
    console.log('batchContractInvoke() : ', JSON.stringify(data))
})
