var Arango = require('arangojs');
var dbUrl = 'http://localhost:8529';

var db = new Arango({url: dbUrl});

module.exports  = {
    db: db
};