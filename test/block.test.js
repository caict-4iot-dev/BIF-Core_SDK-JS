'use strict'

const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
    host: 'http://test.bifcore.bitfactory.cn'
})
/**
 * 查询最新的区块高度
 */
it('test getBlockNumber', async () => {
    let param = {
        domainId: '20'
    }
    let data = await sdk.block.getBlockNumber(param)
    console.log('getBlockNumber() : ', JSON.stringify(data))
})

/**
 * 查询指定区块高度下的所有交易
 */
it('test getTransactions', async () => {
    let param = {
        blockNumber: '1',
        domainId: '20'
    }
    let data = await sdk.block.getTransactions(param)
    console.log('getTransactions() : ', JSON.stringify(data))
})

/**
 * 查询指定区块高度的区块信息
 */
it('test getBlockInfo', async () => {
    let param = {
        blockNumber: '61360',
        domainId: '20'
    }
    let data = await sdk.block.getBlockInfo(param)
    console.log('getBlockInfo() : ', JSON.stringify(data))
})

/**
 * 查询指定区块高度的区块信息
 */
it('test getBlockLatestInfo', async () => {
    let param = {
        domainId: '20'
    }
    let data = await sdk.block.getBlockLatestInfo(param)
    console.log('getBlockLatestInfo() : ', JSON.stringify(data))
})

/**
 * 获取指定区块中所有验证节点数
 */
it('test getValidators', async () => {
    let param = {
        blockNumber: '1',
        domainId: '20'
    }
    let data = await sdk.block.getValidators(param)
    console.log('getValidators() : ', JSON.stringify(data))
})

/**
 * 获取最新区块中所有验证节点数
 */
it('test getLatestValidators', async () => {
    let param = {
        domainId: '20'
    }
    let data = await sdk.block.getLatestValidators(param)
    console.log('getLatestValidators() : ', JSON.stringify(data))
})
