'use strict'
// custom error code: from 12001 to 17000
module.exports = {
    REQUEST_NULL_ERROR: {
        CODE: 12001,
        MSG: 'Request parameter cannot be null'
    },

    INVALID_PRITX_FROM_ERROR: {
        CODE: 12003,
        MSG: 'Invalid Private Transaction Sender'
    },
    INVALID_PRITX_TO_ERROR: {
        CODE: 12005,
        MSG: 'Invalid Private Transaction recipient list'
    },
    INVALID_PRITX_HASH_ERROR: {
        CODE: 12006,
        MSG: 'Invalid Private Transaction Hash'
    },

    INVALID_NUMBER_OF_ARG: {
        CODE: 12008,
        MSG: 'Invalid number of arguments to the function'
    },
    QUERY_RESULT_NOT_EXIST: {
        CODE: 12009,
        MSG: 'Query result not exist'
    },

    INVALID_ARGUMENTS: {
        CODE: 12010,
        MSG: 'Invalid arguments to the function'
    }

}
