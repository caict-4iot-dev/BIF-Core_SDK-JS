'use strict'

const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
    host: 'http://test.bifcore.bitfactory.cn'
})

it('test account.getAccount(address)', async () => {
    let param = {
        address: 'did:bid:efHzcjj3w1eg9B4aoaem5axrBLS8y8JF',
        // address: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB',
        domainId: '20'
    }
    let data = await sdk.account.getAccount(param)
    console.log('getAccount() : ', JSON.stringify(data))
})

it('test account.getAccountBalance(address)', async () => {
    let param = {
        address: 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc',
        domainId: '20'
    }
    let data = await sdk.account.getAccountBalance(param)
    console.log('getAccountBalance() : ', JSON.stringify(data))
})

it('test account.getNonce(address)', async () => {
    let param = {
        address: 'did:bid:efzE8AcDgWUeNbgujA5hK3oUeuG9k19b',
        domainId: '20'
    }
    let data = await sdk.account.getNonce(param)
    console.log('getNonce() : ', JSON.stringify(data))
})

it('test account.createAccount(address)', async () => {

    let createAccountOperation = {
        sourceAddress: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        privateKey: 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK',
        remarks: 'create account',
        destAddress: 'did:bid:efQMuPahc3zm7abBUBfj22xZokhZ7rED',
        initBalance: '100000000000',
        ceilLedgerSeq: '',
        feeLimit: '',
        gasPrice: '',
        domainId: '20'

    }
    let data = await sdk.account.createAccount(createAccountOperation)
    console.log('createAccount() : ', JSON.stringify(data))
})

it('test operation.setMetadatas()', async () => {

    let setMetadatasOperation = {
        sourceAddress: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        privateKey: 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK',
        remarks: 'create account',
        key: '20211217',
        value: 'metadata-20211210',
        version: '1',
        feeLimit: '',
        gasPrice: '',
        domainId: '0'
    }
    let data = await sdk.account.setMetadatas(setMetadatasOperation)
    console.log('setMetadatas() : ', JSON.stringify(data))
})

it('test account.getMetadatas()', async () => {
    let data = await sdk.account.getMetadatas({
        address: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        key: '20211217',
        domainId: '20'
    })
    console.log('getMetadatas() : ', JSON.stringify(data))
})

it('test operation.setPrivilege()', async () => {

    let accountSetPrivilegeOperation = {
        sourceAddress: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        privateKey: 'priSPKpeenYnvVLaGkCg6Lm5c8vsq85htyF62xyFz54eCkJ2rK',
        txThreshold: '8',
        signers: [{
            address: 'did:bid:ef284xXpJLySqXnMcaLVkFWTJyJ6VhpxG',
            weight: '55'
        }],
        typeThresholds: [{
            type: '5',
            threshold: '51'
        }],
        feeLimit: '',
        gasPrice: '',
        domainId: '20'
    }
    let data = await sdk.account.setPrivilege(accountSetPrivilegeOperation)
    console.log('setPrivilege() : ', JSON.stringify(data))
})

it('test account.getAccountPriv(address)', async () => {
    let param = {
        address: 'did:bid:efyJLYwWd7SmKV44QXxRAd7NLCfjKxHB',
        domainId: '20'
    }
    let data = await sdk.account.getAccountPriv(param)
    console.log('getAccountPriv() : ', JSON.stringify(data))
})
