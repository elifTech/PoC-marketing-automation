var db = require('./config').db;
var aql = require('arangojs').aql;
var listsCollection = db.collection('lists');
var Promise = require('bluebird');
var validate = require('jsonschema').validate;
var validationOptions = {
    throwError: true
}

var graph = db.graph('lists_profiles');
var edges = db.edgeCollection('profiles_belongs_to_lists');

var listSchema = {
    "id": "/List",
    "type": "object",
    "properties": {
        "name": {"type": "string"}
    },
    "required": ["name"]
};

function getAllLists(){
    return db.query(aql`
        FOR l IN ${listsCollection}

        LET profiles_list = GRAPH_NEIGHBORS("lists_profiles", l, {direction: "inbound", edgeCollectionRestriction: "profiles_belongs_to_lists", includeData: true})
          RETURN {
            list: l,
            profiles_list: profiles_list
          }
    `)
        .then(cursor => cursor.all());
}

function getList(id){
    return db.query(aql`
        FOR l IN ${listsCollection}
        FILTER l._key == ${id}
        LET profiles_list = GRAPH_NEIGHBORS("lists_profiles", l, {direction: "inbound", edgeCollectionRestriction: "profiles_belongs_to_lists", includeData: true})
          RETURN {
            list: l,
            profiles_list: profiles_list
          }
    `)
        .then(cursor => cursor.all())
        .then(data => data && data[0]);
}

function insertList(list){
    validate(list, listSchema, validationOptions);
    var listResult;
    var profileKeys = list.profiles;
    delete list.profiles;

    return db.query(aql`
        INSERT ${list}
        IN ${listsCollection}
        RETURN NEW
    `)
        .then(cursor => cursor.all() )
        .then(data => {
            listResult = data[0];
            return Promise.all(profileKeys.map((profileKey) => edges.save({_from: "profiles/" + profileKey, _to: listResult._id})));
        })
        .then(() => listResult);
}

function updateList(list){
    validate(list, listSchema, validationOptions);
    var listResult;
    var profileKeys = list.profiles;
    delete list.profiles;

    return db.query(aql`
        UPDATE {_key: ${list._key}}
        WITH ${list}
        IN ${listsCollection}
        RETURN NEW
    `)
        .then(cursor => cursor.all() )
        .then(data => {
            listResult = data[0];
            return db.query(aql`
                FOR l IN profiles_belongs_to_lists
                FILTER l._to == ${listResult._id}
                REMOVE l._key IN profiles_belongs_to_lists
            `)
                .then(() => Promise.all(profileKeys.map(
                    (profileKey) => edges.save({_from: "profiles/" + profileKey, _to: listResult._id})
                )))
        })
        .then(() => listResult);
}

function removeList(listId){
    return db.query(aql`
        REMOVE {_key: ${listId}}
        IN ${listsCollection}
    `);
}

function init(){
    var lists = [
        { "name": "first", profiles: []},
        { "name": "second", profiles: []},
        { "name": "third", profiles: []}
    ];

    return Promise.all([listsCollection.drop(), graph.drop()])
        .catch((err) => console.log("list collection didn't exist"))
        .then(() => listsCollection.create())
        .then(() => Promise.all(lists.map(insertList)))
        .then(() => graph.create({
            edgeDefinitions: [
                {
                    collection: 'profiles_belongs_to_lists',
                    from: [
                        'profiles'
                    ],
                    to: [
                        'lists'
                    ]
                }
            ]
        }));
}

module.exports = {
    getAllLists: getAllLists,
    insertList: insertList,
    updateList: updateList,
    removeList: removeList,
    getList: getList,
    init: init
};
