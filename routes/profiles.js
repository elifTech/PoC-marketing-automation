var Profiles = require('../data_layer/profiles');
var _ = require('lodash');

module.exports.set = ( (app, io) => {

    var debounceTimeForEmittingProfilesChange = 500;
    var emitProfilesChange = _.debounce( () =>
            Profiles.getAllProfiles()
                .then( (lists) => io.emit('profiles change', lists) )
        , debounceTimeForEmittingProfilesChange);

    app.server.get('/api/profile', function(req, res, next){
        Profiles.getAllProfiles()
            .then( (profiles) => res.json({ items: profiles }) )
            .catch( (err) =>{
                console.log(err);
                res.statusCode(400).send(err)
            });

    });

    app.server.get('/api/profile/:profileId', function(req, res, next){
        Profiles.getProfile(req.params.profileId)
            .then( (profile) => res.json(profile) )
            .catch( (err) =>{
                console.log(err);
                res.statusCode(400).send(err)
            });

    });

    app.server.delete('/api/profile/:profileId', function(req, res, next){
        Profiles.removeProfile(req.params.profileId)
            .then( (profiles) => res.send({}) )
            .then( emitProfilesChange )
            .catch( (err) =>{
                console.log(err);
                res.statusCode(400).send(err)
            });

    });

    app.server.post('/api/profile', function(req, res, next){
        var profile = req.body;
        Profiles.insertProfile(profile)
            .then( (profile) => res.send(profile) )
            .then( emitProfilesChange )
            .catch( (err) =>{
                console.log(err);
                res.statusCode(400).send(err)
            });

    });

    app.server.put('/api/profile/:profileId', function(req, res, next){
        var profile = req.body;
        profile._key = req.params.profileId;
        Profiles.updateProfile(profile)
            .then( (profile) => res.send(profile) )
            .then( emitProfilesChange )
            .catch( (err) =>{
                console.log(err);
                res.statusCode(400).send(err);
            });

    });

});