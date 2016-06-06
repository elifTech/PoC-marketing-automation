
var Profiles = require('./profiles');
var Lists = require('./lists');
var Promise = require('bluebird');

Promise.all([
    Profiles.init(),
    Lists.init()
])
    .catch(console.log)
    .then(() => process.exit() )