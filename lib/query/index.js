'use strict'
const is = require('is-type-of')
const rp = require('request-promise')
const keyPair = require('../keypair')
const errors = require('../exception')
const util = require('../common/util')
const config = require('../common/constant')
const JSONbig = require('json-bigint')

class Query {
    constructor(options = {}) {
        this.host = options.host
    }

    async _get (method, params) {
        const options = {
            method: 'GET',
            uri: `${this.host}/${method}?${params}`,
            // json: true,
            timeout: 4000
        }
        let data = await rp(options)
        return JSONbig.parse(data)
    }

    async _post (method, paramsJson) {
        const options = {
            method: 'POST',
            uri: `${this.host}/${method}`,
            body: paramsJson,
            json: true,
            timeout: 4000
        }
        return rp(options)
    }
    /**
     * Get account information
     * @param  {String} address
     * @return {Object}
     */
    async getInfo (address) {
        if (!keyPair.isAddress(address) || address.trim().length === 0) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        try {
            var res = await this._get('getAccount', `address=${address}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return res
        }
        let nonce = res.result.nonce
        nonce = nonce ? nonce : '0'
        return util._responseData({
            address: res.result.address,
            balance: res.result.balance,
            nonce: nonce,
            assets: res.result.assets || [],
            priv: res.result.priv || {},
            metadata: res.result.metadatas
        })
    };

    async getNonce (address) {
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        let info = await this.getInfo(address)
        if (info.errorCode === 0) {
            return util._responseData({
                nonce: info.result.nonce
            })
        }
        return info
    }
    async getMetadatas (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { address, key } = request
        if ((key != '' || key != null) && (key.trim().length > config.METADATA_KEY_MAX || key.trim().length < 1)) {
            return util._responseError(errors.INVALID_DATAKEY_ERROR)
        }
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        try {
            var info = await this._get('getAccount', `address=${address}&key=${key}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (info.error_code !== 0) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
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
        return util._responseData({
            metadata
        })
    }
    async getBlockInfo (blockNumber) {
        try {
            var res = await this._get('getLedger', `seq=${blockNumber}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { confirmTime: res.result.header.close_time, number: blockNumber, txCount: res.result.header.tx_count, version: res.result.header.version }
        return {
            header: data
        }

    }
    async getBlockNumber () {
        try {
            var res = await this._get('getLedger')
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { blockNumber: res.result.header.seq }
        return {
            header: data
        }
    }

    async getTransactions (blockNumber) {
        try {
            var res = await this._get('getTransactionHistory', `ledger_seq=${blockNumber}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        return res
    }

    async getBlockLatestInfo () {
        try {
            var res = await this._get('getLedger')
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { confirmTime: res.result.header.close_time, number: res.result.header.seq, txCount: res.result.header.tx_count, version: res.result.header.version }
        return {
            header: data
        }
    }

    async getValidators (blockNumber) {
        try {
            var res = await this._get('getLedger', `seq=${blockNumber}&with_validator=true`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { validators: res.result.validators }
        return data
    }

    async getLatestValidators () {
        try {
            var res = await this._get('getLedger', 'with_validator=true')
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
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
        try {
            var res = await this._get('getAccountBase', `address=${address}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR)
        }
        return res
    };

    /**
     * 调用合约查询接口
     * @param address
     * @returns {Promise<*>}
     */
    async callContract (paramsJson) {
        try {
            var res = await this._post('callContract', paramsJson)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.INVALID_CONTRACTADDRESS_ERROR)
        }
        return res
    };

    async getContractAddress (hash) {
        try {
            var res = await this._get('getTransactionHistory', `hash=${hash}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.INVALID_CONTRACT_HASH_ERROR)
        }
        const contractAddress = JSON.parse(res.result.transactions[0].error_desc)
        let data = { contract_address_infos: contractAddress }
        return data
    }

    async priSend (paramsJson) {
        try {
            var res = await this._post('priTxSend', paramsJson)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        return res
    }
    async getTransactionByHash (hash) {
        try {
            var res = await this._get('getTransactionHistory', `hash=${hash}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        return res
    }

    async evaluateFee (paramsJson) {
        try {
            var res = await this._post('testTransaction', paramsJson)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        return res
    }

}

module.exports = Query
