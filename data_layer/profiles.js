var db = require('./config').db;
var aql = require('arangojs').aql;
var profilesCollection = db.collection('profiles');

function getAllProfiles(){
    return db.query(aql`
        FOR profile IN ${profilesCollection}
        RETURN profile
    `)
    .then(cursor => cursor.all() );
}


module.exports = {
    getAllProfiles: getAllProfiles
}
