// Depending of the env choose the file for your access keys
process.env.NODE_ENV === 'production'
  ? (module.exports = require('./keys_prod'))
  : (module.exports = require('./keys_dev'));
