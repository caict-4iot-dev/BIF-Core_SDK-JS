'use strict'
const merge = require('merge-descriptors')
const proto = module.exports = {}

merge(proto, require('./errors'))
merge(proto, require('./customErrors'))
