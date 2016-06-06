var express = require('express'),
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    async = require('async');

var app = {
    config: {
        http: {
            port: 5000
        }
    },
    models: {
        profiles: require('../data_layer/profiles')
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
        app.models.profiles.getAllProfiles()
            .then( (profiles) => res.json({ items: profiles }) )
            .catch( (err) =>{
                console.log(err);
                res.sendStatus(500);
        });

    });

    app.server.delete('/api/profile/:profileId', function(req, res, next){
        app.models.profiles.removeProfile(req.params.profileId)
            .then( (profiles) => res.send({}) )
            .catch( (err) =>{
                console.log(err);
                res.sendStatus(500);
            });

    });

    app.server.post('/api/profile', function(req, res, next){
        var profile = req.body;
        app.models.profiles.insertProfile(profile)
            .then( (profile) => res.send(profile) )
            .catch( (err) =>{
                console.log(err);
                res.sendStatus(500);
            });

    });

    app.server.put('/api/profile/:profileId', function(req, res, next){
        var profile = req.body;
        profile._key = req.params.profileId;
        app.models.profiles.updateProfile(profile)
            .then( (profile) => res.send(profile) )
            .catch( (err) =>{
                console.log(err);
                res.sendStatus(500);
            });

    });


    app.server.get('/*', serveStatic(__dirname + '/..', {etag: false}));

    app.server.use(function (err, req, res, next) {
        if (err) {
            var isDev = 'development';
            console.log(err);
            req.log.error({err: {name: err.name, stack: err.stack}}, err.message);
            if (err.name === app.errors.NotFoundError.name) {
                var resultErr = {msg: err.message};
                if (isDev) {
                    resultErr.stack = err.stack;
                }
                return res.status(404).json(resultErr);
            } else if (err.name === app.errors.ValidationError.name) {
                var r = {hasErrors: true};
                if (err.field) {
                    r.fieldErrors = [{field: err.field, msg: err.msg}];
                } else {
                    r.summaryErrors = [{msg: err.msg}];
                }
                return res.status(422).json(r);
            } else if (err.name === app.errors.OperationError.name) {
                return res.status(400).json({msg: err.message});
            } else if (err.name === 'Error') {
                return res.status(500).json({errors: err.errors, code: err.code});
            }
            return next(err);
        }
        next();
    });

    app.server.use(
        function (req, res, next) {
            var indexFile = "index.html", rootDir = '.';
            var path = url.parse(req.url).pathname;

            if(/^\/api/.test(path)) return next();

            return fs.readFile('./' + rootDir + path, function (err, buf) {
                if (!err) {
                    return next();
                }
                if (path.substring(path.length - 4) == 'html') { // if html file not found
                    res.writeHead(404);
                    return res.end('Not found');
                }
                return fs.readFile('./' + rootDir + '/' + indexFile, function (error, buffer) {
                    var resp;
                    if (error) {
                        return next(error);
                    }
                    resp = {
                        headers: {
                            'Content-Type': 'text/html',
                            'Content-Length': buffer.length
                        },
                        body: buffer
                    };
                    res.writeHead(200, resp.headers);
                    return res.end(resp.body);
                });
            });
        }
    );

    app.httpServer.listen(app.config.http.port, next);

    console.info('Start listening on port: ', app.config.http.port);
}


process.on('uncaughtException', function (err) {
    console.error({err: err}, 'Caught exception: ' + err.toString());
    setTimeout(function () {
        process.exit(1);
    }, 500);
});

