var express = require('express'),
    http = require('http'),
    url = require('url'),
    fs = require('fs'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    async = require('async'),
    _ = require('lodash');


var app = {
    config: {
        http: {
            port: 5000
        }
    }
};
exports.app = app;

exports.init = function (next) {
    var startDate = Date.now();

    console.info('Configuration successfully init in', Date.now() - startDate, 'ms');
    next();
};


exports.start = function(next) {
    app.server = express();
    app.httpServer = http.createServer(app.server);

    var io = require('socket.io')(app.httpServer);

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });



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


    require('../routes/lists').set(app, io);
    require('../routes/profiles').set(app, io);


    app.server.get('/*', serveStatic(__dirname + '/..', {etag: false}));

    app.server.use(function (err, req, res, next) {
        if (err) {
            var isDev = 'development';

            console.log({err: {name: err.name, stack: err.stack}}, err.message);
            return res.status(400).json({msg: err.message});
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

