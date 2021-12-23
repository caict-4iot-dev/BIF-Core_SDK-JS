'use strict'

const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
     host: 'http://test-bif-core.xinghuo.space'
})

it('test account.getAccount(address)', async () => {
    let address = 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc'
    let data = await sdk.account.getAccount(address)
    console.log('getAccount() : ', JSON.stringify(data))
})

it('test account.getAccountBalance(address)', async () => {
    let address = 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc'
    let data = await sdk.account.getAccountBalance(address)
    console.log('getAccountBalance() : ', JSON.stringify(data))
})

it('test account.getNonce(address)', async () => {
    let address = 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc'
    let data = await sdk.account.getNonce(address)
    console.log('getNonce() : ', JSON.stringify(data))
})
it('test account.createAccount(address)', async () => {

    let createAccountOperation = {
        sourceAddress: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2',
        privateKey: 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL',
        remarks: 'create account',
        destAddress: 'did:bid:efQMuPahc3zm7abBUBfj22xZokhZ7rED',
        initBalance: '100000000000',
        ceilLedgerSeq: ''
    }
    let data = await sdk.account.createAccount(createAccountOperation)
    console.log('createAccount() : ', JSON.stringify(data))
})

it('test operation.setMetadatas()', async () => {

    let setMetadatasOperation = {
        sourceAddress: 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc',
        privateKey: 'priSPKff1hvKVFYYFKSgfMb17wJ4dYZAHhLREarvh4Cy6fgn5b',
        remarks: 'create account',
        key: '20211217',
        value: 'metadata-20211210',
        version: '1'
    }
    let data = await sdk.account.setMetadatas(setMetadatasOperation)
    console.log('setMetadatas() : ', JSON.stringify(data))
})

it('test account.getMetadatas()', async () => {
    let data = await sdk.account.getMetadatas({
        address: 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc',
        key: '20211208'
    })
    console.log('getMetadatas() : ', JSON.stringify(data))
})

it('test operation.setPrivilege()', async () => {

    let accountSetPrivilegeOperation = {
        sourceAddress: 'did:bid:efMrjMzYWUBBLZBwgsWtxEvdfQe5wejB',
        privateKey: 'priSPKqYp19ghxeCykHUrepLRkCRD3a2a9y5MJGF8Kc4qfn2aK',
        txThreshold: '8',
        signers: [{
            address: 'did:bid:ef284xXpJLySqXnMcaLVkFWTJyJ6VhpxG',
            weight: '55'
        }],
        typeThresholds: [{
            type: '5',
            threshold: '51'
        }]
    }
    let data = await sdk.account.setPrivilege(accountSetPrivilegeOperation)
    console.log('setPrivilege() : ', JSON.stringify(data))
})

it('test account.getAccountPriv(address)', async () => {
    let address = 'did:bid:efMrjMzYWUBBLZBwgsWtxEvdfQe5wejB'
    let data = await sdk.account.getAccountPriv(address)
    console.log('getAccountPriv() : ', JSON.stringify(data))
})
