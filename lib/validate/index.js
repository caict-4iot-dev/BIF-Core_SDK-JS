'use strict'
const wrap = require('co-wrap-all')
const merge = require('merge-descriptors')
module.exports = Operation
function Operation () {
}
const proto = Operation.prototype
merge(proto, require('../common/util'))
merge(proto, require('./transaction'))
merge(proto, require('./account'))
merge(proto, require('./contract'))
wrap(proto)
