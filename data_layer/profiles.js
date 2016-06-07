var db = require('./config').db;
var aql = require('arangojs').aql;
var profilesCollection = db.collection('profiles');
var Promise = require('bluebird');
var validate = require('jsonschema').validate;
var validationOptions = {
    throwError: true
}

var profileSchema = {
    "id": "/Profile",
    "type": "object",
    "properties": {
        "email": {"type": "string", "format": "email"},
        "name": {"type": "string"}
    },
    "required": ["name", "email"]
};

function getAllProfiles(){
    return db.query(aql`
        FOR profile IN ${profilesCollection}
        RETURN profile
    `)
    .then(cursor => cursor.all() );
}

function getProfile(profileId){
    return db.query(aql`
        FOR profile IN ${profilesCollection}
        FILTER profile._key == ${profileId}
        LET lists = GRAPH_NEIGHBORS("lists_profiles", profile, {direction: "outbound", edgeCollectionRestriction: "profiles_belongs_to_lists", includeData: true})
          RETURN {
            profile: profile,
            lists: lists
          }
    `)
        .then(cursor => cursor.all() )
        .then(data => data && data[0]);
}

function insertProfile(profile){
    validate(profile, profileSchema, validationOptions);
    return db.query(aql`
        INSERT ${profile}
        IN ${profilesCollection}
        RETURN NEW
    `)
        .then(cursor => cursor.all() )
        .then(data => data[0]);
}

function updateProfile(profile){
    validate(profile, profileSchema, validationOptions);
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

    return profilesCollection.drop()
        .catch((err) => console.log("profiles collection didn't exist"))
        .then( () =>profilesCollection.create() )
        .then(() => Promise.all(profiles.map(insertProfile)));
}


module.exports = {
    getAllProfiles: getAllProfiles,
    insertProfile: insertProfile,
    updateProfile: updateProfile,
    removeProfile: removeProfile,
    getProfile: getProfile,
    init: init
};
