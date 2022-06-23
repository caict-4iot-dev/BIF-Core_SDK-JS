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
    async getInfo (address, domainId) {
        if (!keyPair.isAddress(address) || address.trim().length === 0) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        try {
            var res = await this._get('getAccount', `address=${address}&domainId=${domainId}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._response(res)
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

    async getNonce (address, domainId) {
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        let info = await this.getInfo(address, domainId)
        if (info.errorCode === 0) {
            return util._responseData({
                nonce: info.result.nonce
            })
        }
        if (info.errorCode !== 0 && info.errorCode == config.ERRORCODE) {
            let infos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'Account (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return infos
        } else if (info.errorCode !== 0 && info.errorCode == config.DOMAINID_ERRORCODE) {
            let domainIdInfos = {
                errorCode: info.errorCode,
                errorDesc: (info.errorDesc == null || info.errorDesc == '') ? 'DomainId (' + domainId + ') (' + address + ') not exist' : info.errorDesc,
                result: info.result
            }
            return domainIdInfos
        } else if (info.errorCode !== 0) {
            return util._response(info)
        }
    }

    async getMetadatas (request = {}) {
        if (is.array(request) || !is.object(request)) {
            return util._responseError(errors.REQUEST_NULL_ERROR)
        }
        let { address, key, domainId } = request
        if ((key != '' || key != null) && (key.trim().length > config.METADATA_KEY_MAX || key.trim().length < 1)) {
            return util._responseError(errors.INVALID_DATAKEY_ERROR)
        }
        if (!keyPair.isAddress(address)) {
            return util._responseError(errors.INVALID_ADDRESS_ERROR)
        }
        if (domainId != null && domainId != '' && !util._isAvailableValue(domainId)) {
            return util._responseError(errors.INVALID_DOMAINID_ERROR)
        }
        if (domainId == null || domainId == '') {
            domainId = config.INIT_ZERO
        }
        try {
            var info = await this._get('getAccount', `address=${address}&key=${key}&domainId=${domainId}`)
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

    async getBlockInfo (blockNumber, domainId) {
        try {
            var res = await this._get('getLedger', `seq=${blockNumber}&domainId=${domainId}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { confirmTime: res.result.header.close_time, number: blockNumber, txCount: res.result.header.tx_count, version: res.result.header.version, hash: res.result.header.hash }
        return {
            header: data
        }

    }
    async getBlockNumber (domainId) {
        try {
            var res = await this._get('getLedger', `domainId=${domainId}`)
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

    async getTransactions (blockNumber, domainId) {
        try {
            var res = await this._get('getTransactionHistory', `ledger_seq=${blockNumber}&domainId=${domainId}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        return res
    }

    async getBlockLatestInfo (domainId) {
        try {
            var res = await this._get('getLedger', `domainId=${domainId}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { confirmTime: res.result.header.close_time, number: res.result.header.seq, txCount: res.result.header.tx_count, version: res.result.header.version, hash: res.result.header.hash }
        return {
            header: data
        }
    }

    async getValidators (blockNumber, domainId) {
        try {
            var res = await this._get('getLedger', `seq=${blockNumber}&with_validator=true&domainId=${domainId}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { validators: res.result.validators }
        return data
    }

    async getLatestValidators (domainId) {
        try {
            var res = await this._get('getLedger', `with_validator=true&domainId=${domainId}`)
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
    async getContractBase (address, domainId) {
        try {
            var res = await this._get('getAccountBase', `address=${address}&domainId=${domainId}`)
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

    async getContractAddress (hash, domainId) {
        try {
            var res = await this._get('getTransactionHistory', `hash=${hash}&domainId=${domainId}`)
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.INVALID_CONTRACT_HASH_ERROR)
        }
        if (res.error_code == 0 && res.result.transactions[0].error_code !== 0) {
            let infos = {
                errorCode: res.result.transactions[0].error_code,
                errorDesc: (res.result.transactions[0].error_desc == null || res.result.transactions[0].error_desc == '') ? '' : res.result.transactions[0].error_desc
            }
            return infos
        }
        const contractAddress = res.result.transactions[0].error_desc
        let data = { contract_address_infos: contractAddress }
        return util._response(data)
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
    async getTransactionByHash (hash, domainId) {
        try {
            var res = await this._get('getTransactionHistory', `hash=${hash}&domainId=${domainId}`)
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

    async getTxCacheSize () {
        try {
            var res = await this._get('getTxCacheSize')
        } catch (e) {
            return util._responseError(errors.CONNECTNETWORK_ERROR)
        }
        if (res.error_code !== 0) {
            return util._responseError(errors.QUERY_RESULT_NOT_EXIST)
        }
        let data = { txCacheSize: res.queue_size }
        return {
            header: data
        }
    }

}

module.exports = Query
