var Lists = require('../data_layer/lists');
var _ = require('lodash');


module.exports.set = ( (app, io) => {

    var debounceTimeForEmittingListChange = 500;
    var emitListsChange = _.debounce( emitListsChange =>
            Lists.getAllLists()
                .then( (lists) => io.emit('lists change', lists) )
        , debounceTimeForEmittingListChange);

    app.server.get('/api/list', function(req, res, next){
        Lists.getAllLists()
            .then( (profiles) => res.json({ items: profiles }) )
            .catch( (err) =>{
                if(err) return next(err);
                res.statusCode(err.code || 400).send(err)
            });
    });

    app.server.get('/api/list/:listId', function(req, res, next){
        Lists.getList(req.params.listId)
            .then( (list) => res.json(list) )
            .catch( (err) =>{
                if(err) return next(err);
                res.statusCode(err.code || 400).send(err)
            });
    });

    app.server.delete('/api/list/:listId', function(req, res, next){
        Lists.removeList(req.params.listId)
            .then( (profiles) => res.send({}) )
            .then( emitListsChange )
            .catch( (err) =>{
                console.log(err);
                res.statusCode(400).send(err)
            });

    });

    app.server.post('/api/list', function(req, res, next){
        var list = req.body;
        Lists.insertList(list)
            .then( (profile) => res.send(profile) )
            .then( emitListsChange )
            .catch( (err) =>{
                console.log(err);
                res.statusCode(400).send(err)
            });

    });

    app.server.put('/api/list/:listId', function(req, res, next){
        var list = req.body;
        list._key = req.params.listId;
        Lists.updateList(list)
            .then( (profile) => res.send(profile) )
            .then( emitListsChange )
            .catch( (err) =>{
                console.log(err);
                res.statusCode(400).send(err);
            });

    });

});