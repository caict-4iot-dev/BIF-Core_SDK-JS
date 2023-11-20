'use strict'
module.exports = {
    ACCOUNT_CREATE_ERROR: {
        CODE: 11001,
        MSG: 'Failed to create the account'
    },
    INVALID_SOURCEADDRESS_ERROR: {
        CODE: 11002,
        MSG: 'Invalid sourceAddress'
    },
    INVALID_DESTADDRESS_ERROR: {
        CODE: 11003,
        MSG: 'Invalid destAddress'
    },
    INVALID_INITBALANCE_ERROR: {
        CODE: 11004,
        MSG: 'InitBalance must between 1 and Long.MAX_VALUE'
    },
    SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR: {
        CODE: 11005,
        MSG: 'SourceAddress cannot be equal to destAddress'
    },
    INVALID_ADDRESS_ERROR: {
        CODE: 11006,
        MSG: 'Invalid address'
    },
    CONNECTNETWORK_ERROR: {
        CODE: 11007,
        MSG: 'Failed to connect to the network'
    },
    METADATA_NOT_HEX_STRING_ERROR: {
        CODE: 11008,
        MSG: 'AssetAmount this will be issued mustbetween 1 and max(int64)'
    },
    NO_METADATA_ERROR: {
        CODE: 11010,
        MSG: 'This account does not have this metadata'
    },
    INVALID_DATAKEY_ERROR: {
        CODE: 11011,
        MSG: 'The length of key must between 1 and 1024'
    },
    INVALID_DATAVALUE_ERROR: {
        CODE: 11012,
        MSG: 'The length of value must between 0 and 256000'
    },
    INVALID_DATAVERSION_ERROR: {
        CODE: 11013,
        MSG: 'The version must be equal or bigger than 0'
    },
    INVALID_MASTERWEIGHT_ERROR: {
        CODE: 11015,
        MSG: 'MasterWeight must between 0 and max(uint32)'
    },
    INVALID_SIGNER_ADDRESS_ERROR: {
        CODE: 11016,
        MSG: 'Invalid signer address'
    },
    INVALID_SIGNER_WEIGHT_ERROR: {
        CODE: 11017,
        MSG: 'Signer weight must between 0 and max(uint32)'
    },
    INVALID_TX_THRESHOLD_ERROR: {
        CODE: 11018,
        MSG: 'TxThreshold must between 0 and max(int64)'
    },
    INVALID_OPERATION_TYPE_ERROR: {
        CODE: 11019,
        MSG: 'Type of typeThreshold is invalid'
    },
    INVALID_TYPE_THRESHOLD_ERROR: {
        CODE: 11020,
        MSG: 'TypeThreshold must between 0 and max(int64)'
    },
    INVALID_ASSET_CODE_ERROR: {
        CODE: 11023,
        MSG: 'Invalid code'
    },
    INVALID_AMOUNT_ERROR: {
        CODE: 11024,
        MSG: 'Amount must between 0 and max(int64)'
    },
    INVALID_CONTRACT_HASH_ERROR: {
        CODE: 11025,
        MSG: 'Invalid transaction hash to create contract'
    },
    INVALID_GAS_AMOUNT_ERROR: {
        CODE: 11026,
        MSG: 'bifAmount must be between 0 and Long.MAX_VALUE'
    },
    INVALID_ISSUER_ADDRESS_ERROR: {
        CODE: 11027,
        MSG: 'Invalid issuer address'
    },
    NO_SUCH_TOKEN_ERROR: {
        CODE: 11030,
        MSG: 'No such token'
    },
    INVALID_TOKEN_NAME_ERROR: {
        CODE: 11031,
        MSG: 'The length of token name must between 1 and 1024'
    },
    INVALID_TOKEN_SYMBOL_ERROR: {
        CODE: 11032,
        MSG: 'The length of symbol must between 1 and 1024'
    },
    INVALID_TOKEN_DECIMALS_ERROR: {
        CODE: 11033,
        MSG: 'Decimals must between 0 and 8'
    },
    INVALID_TOKEN_TOTALSUPPLY_ERROR: {
        CODE: 11034,
        MSG: 'TotalSupply must between 1 and max(int64)'
    },
    INVALID_TOKENOWNER_ERRPR: {
        CODE: 11035,
        MSG: 'Invalid token owner'
    },
    INVALID_CONTRACTADDRESS_ERROR: {
        CODE: 11037,
        MSG: 'Invalid contract address'
    },
    CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR: {
        CODE: 11038,
        MSG: 'ContractAddress is not a contract account'
    },
    INVALID_TOKEN_AMOUNT_ERROR: {
        CODE: 11039,
        MSG: 'Token amount must between 1 and max(int64)'
    },
    SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR: {
        CODE: 11040,
        MSG: 'SourceAddress cannot be equal to contractAddress'
    },
    INVALID_FROMADDRESS_ERROR: {
        CODE: 11041,
        MSG: 'Invalid fromAddress'
    },
    FROMADDRESS_EQUAL_DESTADDRESS_ERROR: {
        CODE: 11042,
        MSG: 'FromAddress cannot be equal to destAddress'
    },
    INVALID_SPENDER_ERROR: {
        CODE: 11043,
        MSG: 'Invalid spender'
    },
    PAYLOAD_EMPTY_ERROR: {
        CODE: 11044,
        MSG: 'Payload must be a non-empty string'
    },
    INVALID_LOG_TOPIC_ERROR: {
        CODE: 11045,
        MSG: 'The length of log topic must between 1 and 128'
    },
    INVALID_LOG_DATA_ERROR: {
        CODE: 11046,
        MSG: 'The length of one of log data must between 1 and 1024'
    },
    INVALID_CONTRACT_TYPE_ERROR: {
        CODE: 11047,
        MSG: 'Invalid contract type'
    },
    INVALID_NONCE_ERROR: {
        CODE: 11048,
        MSG: 'Nonce must between 1 and max(int64)'
    },
    INVALID_GASPRICE_ERROR: {
        CODE: 11049,
        MSG: 'GasPrice must be between 0 and Long.MAX_VALUE'
    },
    INVALID_FEELIMIT_ERROR: {
        CODE: 11050,
        MSG: 'FeeLimit must be between 0 and Long.MAX_VALUE'
    },
    OPERATIONS_EMPTY_ERROR: {
        CODE: 11051,
        MSG: 'Operations cannot be empty'
    },
    INVALID_CEILLEDGERSEQ_ERROR: {
        CODE: 11052,
        MSG: 'CeilLedgerSeq must be equal to or greater than 0'
    },
    OPERATIONS_ONE_ERROR: {
        CODE: 11053,
        MSG: 'One of operations error'
    },
    INVALID_SIGNATURENUMBER_ERROR: {
        CODE: 11054,
        MSG: 'SignagureNumber must between 1 and max(int32)'
    },
    INVALID_HASH_ERROR: {
        CODE: 11055,
        MSG: 'Invalid transaction hash'
    },
    INVALID_SERIALIZATION_ERROR: {
        CODE: 11056,
        MSG: 'Invalid serialization'
    },
    PRIVATEKEY_NULL_ERROR: {
        CODE: 11057,
        MSG: 'PrivateKeys cannot be empty'
    },
    PRIVATEKEY_ONE_ERROR: {
        CODE: 11058,
        MSG: 'One of privateKeys is invalid'
    },
    INVALID_BLOCKNUMBER_ERROR: {
        CODE: 11060,
        MSG: 'BlockNumber must bigger than 0'
    },
    URL_EMPTY_ERROR: {
        CODE: 11062,
        MSG: 'Url cannot be empty'
    },
    CONTRACTADDRESS_CODE_BOTH_NULL_ERROR: {
        CODE: 11063,
        MSG: 'ContractAddress and code cannot be empty at the same time'
    },
    INVALID_OPTTYPE_ERROR: {
        CODE: 11064,
        MSG: 'OptType must between 0 and 2'
    },
    GET_ALLOWANCE_ERROR: {
        CODE: 11065,
        MSG: 'Get allowance failed'
    },
    GET_TOKEN_INFO_ERROR: {
        CODE: 11066,
        MSG: 'Fail to get token info'
    },
    QUERY_RESULT_NOT_EXIST: {
        CODE: 15014,
        MSG: 'Query result not exist'
    },
    SYSTEM_ERROR: {
        CODE: 20000,
        MSG: 'System error'
    },
    INVALID_DOMAINID_ERROR: {
        CODE: 12007,
        MSG: 'Domainid must be equal to or greater than 0'
    },
    ERRCODE_SIGNATURE_ERROR: {
        CODE: 11067,
        MSG: 'Invalid signatures'
    },
}
