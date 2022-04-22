'use strict'

const BIFCoreSDK = require('../index')
const sdk = new BIFCoreSDK({
     host: 'http://test.bifcore.bitfactory.cn'
})
/**
 * 查询最新的区块高度
 */
it('test getBlockNumber', async () => {
    let data = await sdk.block.getBlockNumber()
    console.log('getBlockNumber() : ', JSON.stringify(data))
})

/**
 * 查询指定区块高度下的所有交易
 */
it('test getTransactions', async () => {
    let blockNumber = '1'
    let data = await sdk.block.getTransactions(blockNumber)
    console.log('getTransactions() : ', JSON.stringify(data))
})

/**
 * 查询指定区块高度的区块信息
 */
it('test getBlockInfo', async () => {
    let blockNumber = '61360'
    let data = await sdk.block.getBlockInfo(blockNumber)
    console.log('getBlockInfo() : ', JSON.stringify(data))
})

/**
 * 查询指定区块高度的区块信息
 */
it('test getBlockLatestInfo', async () => {
    let data = await sdk.block.getBlockLatestInfo()
    console.log('getBlockLatestInfo() : ', JSON.stringify(data))
})

/**
 * 获取指定区块中所有验证节点数
 */
it('test getValidators', async () => {
    let blockNumber = '1'
    let data = await sdk.block.getValidators(blockNumber)
    console.log('getValidators() : ', JSON.stringify(data))
})

/**
 * 获取最新区块中所有验证节点数
 */
it('test getLatestValidators', async () => {
    let data = await sdk.block.getLatestValidators()
    console.log('getLatestValidators() : ', JSON.stringify(data))
})
