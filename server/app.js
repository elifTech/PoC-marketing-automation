var express = require('express'),
    http = require('http'),
    path = require('path'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    async = require('async');

var profiles = require('../data_layer/profiles');

var app = {
    config: {
        http: {
            port: 5000
        }
    },
    models: {
        // parking: require('./models/parking.js')
    }
};
exports.app = app;

exports.init = function (next) {
    var startDate = Date.now();

    async.auto({
        'db': function (next) {
            console.info('Connecting to DB...');
            next();
        }
    }, function (err) {
        if (err) { return next(err); }

        console.info('Configuration successfully loaded in', Date.now() - startDate, 'ms');
        next();
    });
};

exports.start = function(next) {
    app.server = express();
    app.httpServer = http.createServer(app.server);

    var corsOptionsDelegate = function(req, callback){
        var corsOptions = {};
        corsOptions.origin = true;
        corsOptions.credentials = true;
        corsOptions.exposedHeaders = ['x-total-count'];
        callback(null, corsOptions);
    };
    app.server.use(cors(corsOptionsDelegate));

    app.server.use(bodyParser.json({ limit: '50mb' }));
    app.server.use(function (req, res, next) {
        req.app = app;
        next();
    });

    app.server.get('/api', function(req, res, next){
        res.json({ success: true });
    });

    app.server.get('/api/profile', function(req, res, next){
        profiles.getAllProfiles()
            .then( (profiles) => res.json({ items: profiles }) )
            .catch( (err) =>{
                console.log(err);
                res.sendStatus(500);
        });

    });
    
    app.httpServer.listen(app.config.http.port, next);

    console.info('Start listening on port: ', app.config.http.port);
}


process.on('uncaughtException', function (err) {
    console.error({err: err}, 'Caught exception: ' + err.toString());
    setTimeout(function () {
        process.exit(1);
    }, 500);
});

