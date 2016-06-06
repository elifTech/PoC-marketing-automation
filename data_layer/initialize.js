
var Profiles = require('./profiles');


Profiles.init()
    .catch(console.log)
    .then(() => process.exit() )