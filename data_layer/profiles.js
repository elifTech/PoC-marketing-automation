var db = require('./config').db;
var aql = require('arangojs').aql;
var profilesCollection = db.collection('profiles');
var Promise = require('bluebird');

function getAllProfiles(){
    return db.query(aql`
        FOR profile IN ${profilesCollection}
        RETURN profile
    `)
    .then(cursor => cursor.all() );
}

function insertProfile(profile){
    return db.query(aql`
        INSERT ${profile}
        IN ${profilesCollection}
        RETURN NEW
    `)
        .then(cursor => cursor.all() )
        .then(data => data[0]);
}

function updateProfile(profile){
    return db.query(aql`
        UPDATE {_key: ${profile._key}}
        WITH ${profile}
        IN ${profilesCollection}
        RETURN NEW
    `)
        .then(cursor => cursor.all() )
        .then(data => data[0]);
}

function removeProfile(profileId){
    return db.query(aql`
        REMOVE {_key: ${profileId}}
        IN ${profilesCollection}
    `);
}

function init(){
    var profiles = [
        { "name": "new2", "email":"test@test.com" },
        { "name": "Bob", "email":"test2@test.com" },
        { "name": "Sarach", "email":"test3@test.com" }
    ];

    return profilesCollection.create()
        .then(() => Promise.all(profiles.map(insertProfile)));
}


module.exports = {
    getAllProfiles: getAllProfiles,
    insertProfile: insertProfile,
    updateProfile: updateProfile,
    removeProfile: removeProfile,
    init: init
};
