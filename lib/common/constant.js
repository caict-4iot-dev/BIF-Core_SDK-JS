let config = {
    feeLimit: '1000000',
    gasPrice: '100',
    contract_query_type: 2, // 合约查询类型
    METADATA_KEY_MAX: '1024',
    INIT_ZERO: '0',
    HASH_HEX_LENGTH: 64,
    CONNECTNETWORK_ERROR: 11007,
    ERRORCODE: 4,
    DOMAINID_ERRORCODE: 170,
    GET_CONTRACTADDRESS_ERRORCODE: 151 // 通过hash获取地址时底层链返回错误码
}
module.exports = config
