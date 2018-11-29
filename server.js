/* global require */
(function (){
    const WEBHOOK_URL = require('./config')['WEBHOOK_URL'];
    var rp = require('request-promise');
    var ServerReact = new ServerConstructor('react');
    ServerReact.init();

    function ServerConstructor (type){
        var express, app, http, socket, exec, TS_FILEPATH_TEMPLATE, TS_FILEPATH_EXEC, me, TS_FILEPATH_TEMPLATE_REL;
        me = this;

        express = require('express');
        app = express();
        http = require('http').Server(app);
        socket = require('socket.io')(http);
        exec = require('child_process').exec;

        this.type = type;
        this.port = 5667;

        this.init = function (){
            this.setupPaths();
            socket.on('connection', function (socket){
                console.log('a user connected');
                socket.on('disconnect', function (){
                    console.log('user disconnected');
                });
            });
            http.listen(this.port, function (){
                console.log('Server started; port: ' + me.port);
            });
            return this;
        };

        this.indexPage = function (req, res){
            res.render('indexReact', {title: 'Get Cat React'});
        };

        this.handleReadFileRequest = function (req, res){
            res.end();
        };

        this.handleSubmitRequest = function (req, res){
            res.end();
        };

        this.handleUserRequest = function (request, res){
            res.end();
        };

        this.handleAddRecordRequest = function (req, res){
            console.log('add', WEBHOOK_URL)
            var data = '';
            req
                .on('data', function (chunk){
                    data += chunk;
                })
                .on('end', function (){
                    res.end('ok');
                    var options = {
                        method: 'POST',
                        uri: WEBHOOK_URL,
                        body: {
                            text: JSON.parse(data).data + '6143'
                        },
                        json: true
                    };

                    rp(options)
                        .then(function (parsedBody){
                        })
                        .catch(function (err){
                        });
                });
        };

        this.handleDeleteRecordRequest = function (req, res){
            res.end();
        };


        this.setupPaths = function (){
            app.set('view engine', 'jade');
            app.use(express.static('static'));

            app.post('/add', this.handleAddRecordRequest.bind(this));
            app.get('/read', this.handleReadFileRequest.bind(this));
            app.post('/remove', this.handleDeleteRecordRequest.bind(this));
            app.get('/submit', this.handleSubmitRequest.bind(this));

            app.get('/user', this.handleUserRequest.bind(this));
            app.get('/', this.indexPage.bind(this));
        };
    }

})();