'use strict'

const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
    host: 'http://test.bifcore.bitfactory.cn'
})

it('test account.getAccount(address)', async () => {
    let address = 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5'
    let data = await sdk.account.getAccount(address)
    console.log('getAccount() : ', JSON.stringify(data))
})

it('test account.getAccountBalance(address)', async () => {
    let address = 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5'
    let data = await sdk.account.getAccountBalance(address)
    console.log('getAccountBalance() : ', JSON.stringify(data))
})

it('test account.getNonce(address)', async () => {
    let address = 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5'
    let data = await sdk.account.getNonce(address)
    console.log('getNonce() : ', JSON.stringify(data))
})
it('test account.createAccount(address)', async () => {

    let createAccountOperation = {
        sourceAddress: 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5',
        privateKey: 'priSPKkLzxxmGehL534YiXsov9xF8ssioBWuM3xiubDqTERZiE',
        remarks: 'create account',
        destAddress: 'did:bid:efQMuPahc3zm7abBUBfj22xZokhZ7rED',
        initBalance: '100000000000',
        ceilLedgerSeq: '',
        feeLimit: '',
        gasPrice: ''

    }
    let data = await sdk.account.createAccount(createAccountOperation)
    console.log('createAccount() : ', JSON.stringify(data))
})

it('test operation.setMetadatas()', async () => {

    let setMetadatasOperation = {
        sourceAddress: 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5',
        privateKey: 'priSPKkLzxxmGehL534YiXsov9xF8ssioBWuM3xiubDqTERZiE',
        remarks: 'create account',
        key: '20211217',
        value: 'metadata-20211210',
        version: '1',
        feeLimit: '',
        gasPrice: ''
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
        sourceAddress: 'did:bid:ef4NWJx2enwNzpnh3w5SJcj9Qhoddaa5',
        privateKey: 'priSPKkLzxxmGehL534YiXsov9xF8ssioBWuM3xiubDqTERZiE',
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
        gasPrice: ''
    }
    let data = await sdk.account.setPrivilege(accountSetPrivilegeOperation)
    console.log('setPrivilege() : ', JSON.stringify(data))
})

