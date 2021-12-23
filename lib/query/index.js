'use strict'
const is = require('is-type-of')
const rp = require('request-promise')
const keyPair = require('../keypair')
const errors = require('../exception')
const unit = require('../common/util')

class Query {
    constructor(options = {}) {
        this.host = options.host
    }

    async _get (method, params) {
        const options = {
            method: 'GET',
            uri: `${this.host}/${method}?${params}`,
            json: true
        }
        return rp(options)
    }

    async _post (method, paramsJson) {
        const options = {
            method: 'POST',
            uri: `${this.host}/${method}`,
            body: paramsJson,
            json: true
        }
        return rp(options)
    }
    /**
     * Get account information
     * @param  {String} address
     * @return {Object}
     */
    async getInfo (address) {
        if (!keyPair.isAddress(address)) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        const res = await this._get('getAccount', `address=${address}`)
        if (res.error_code !== 0) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let nonce = res.result.nonce
        nonce = nonce ? nonce : '0'
        return unit._responseData({
            address: res.result.address,
            balance: res.result.balance,
            nonce: nonce,
            assets: res.result.assets || [],
            priv: res.result.priv || {},
            metadata: res.result.metadatas
        })
    };

    async getNonce (address) {
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return unit._responseData({
                nonce: info.result.nonce
            })
        }
        return unit._responseError(errors.INVALID_ADDRESS_ERROR)
    }
    async getMetadatas (request = {}) {
        let { address, key } = request
        if (!keyPair.isAddress(address)) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        const info = await this._get('getAccount', `address=${address}&key=${key}`)
        if (info.error_code !== 0) {
            return unit._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        const data = info.result
        const metadata = {}
        const metadatas = data.metadatas

        if (metadatas && is.array(metadatas) && metadatas.length > 0) {
            metadatas.some(item => {
                if (item.key === key) {
                    metadata.key = item.key
                    metadata.value = item.value
                    metadata.version = item.version
                    return true
                }
            })
        }
        return unit._responseData({
            metadata
        })
    }
    async getBlockInfo (blockNumber) {
        const res = await this._get('getLedger', `seq=${blockNumber}`)
        if (res.error_code !== 0) {
            return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { confirmTime: res.result.header.close_time, number: blockNumber, txCount: res.result.header.tx_count, version: res.result.header.version }
        return {
            header: data
        }

    }
    async getBlockNumber () {
        const res = await this._get('getLedger')
        if (res.error_code !== 0) {
            return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { blockNumber: res.result.header.seq }
        return {
            header: data
        }
    }

    async getTransactions (blockNumber) {
        return await this._get('getTransactionHistory', `ledger_seq=${blockNumber}`)
    }

    async getBlockLatestInfo () {
        const res = await this._get('getLedger')
        if (res.error_code !== 0) {
            return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { confirmTime: res.result.header.close_time, number: res.result.header.seq, txCount: res.result.header.tx_count, version: res.result.header.version }
        return {
            header: data
        }
    }

    async getValidators (blockNumber) {
        const res = await this._get('getLedger', `seq=${blockNumber}&with_validator=true`)
        if (res.error_code !== 0) {
            return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { validators: res.result.validators }
        return data
    }

    async getLatestValidators () {
        const res = await this._get('getLedger', 'with_validator=true')
        if (res.error_code !== 0) {
            return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { validators: res.result.validators }
        return data
    }

    /**
     * Get contract information
     * @param  {String} address
     * @return {Object}
     */
    async getContractBase (address) {
        const res = await this._get('getAccountBase', `address=${address}`)
        if (res.error_code !== 0) {
            return unit._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR)
        }
        return res
    };

    /**
     * 调用合约查询接口
     * @param address
     * @returns {Promise<*>}
     */
    async callContract (paramsJson) {
        return await this._post('callContract', paramsJson)
    };

    async getContractAddress (hash) {
        const res = await this._get('getTransactionHistory', `hash=${hash}`)
        if (res.error_code !== 0) {
            return unit._responseError(errors.INVALID_CONTRACT_HASH_ERROR)
        }
        const contractAddress = JSON.parse(res.result.transactions[0].error_desc)
        let data = { contract_address_infos: contractAddress }
        return data
    }

    async priSend (paramsJson) {
        const res = await this._post('priTxSend', paramsJson)
        if (res.error_code !== 0) {
            return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        return res
    }
    async getTransactionByHash (hash) {
        const res = await this._get('getTransactionHistory', `hash=${hash}`)
        if (res.error_code !== 0) {
            return unit._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        return res
    }

    async evaluateFee (paramsJson) {
        const res = await this._post('testTransaction', paramsJson)
        return res
    }

}

module.exports = Query
