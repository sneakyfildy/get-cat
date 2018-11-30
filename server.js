/* global require */
(function (){
    const WEBHOOK_URL = require('./config')['WEBHOOK_URL'];
    let express = require('express');
    let rp = require('request-promise');
    let pb = require('./modules/pikabu-utils');
    let cheerio = require('cheerio');
    let iconv = require('iconv-lite');
    let http = require('http');
    let https = require('https')

    var ServerReact = new ServerConstructor('react');
    ServerReact.init();

    function ServerConstructor (type){
        let app = express();
        let server = http.Server(app);

        var me = this;

        this.type = type;
        this.port = 5667;

        this.init = function (){
            this.setupPaths();
            server.listen(this.port, function (){
                console.log('Server started; port: ' + me.port);
            });
            this.tryLoad();
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
            console.log('send');
            var data = '';
            req
                .on('data', function (chunk){
                    data += chunk;
                })
                .on('end', () => {
                    res.end('ok');
                    this.tryLoad(cb);

                    function cb (title, link, imgSrc) {
                        var msg = {
                            "attachments": [
                                {
                                    "fallback": "Required plain-text summary of the attachment.",
                                    "color": "#36a64f",
                                    //"pretext": "",
                                    "author_name": "Pikabu",
                                    "author_link": "https://pikabu.ru",
                                    "author_icon": "https://cs.pikabu.ru/apps/desktop/1.17.0/images/sprite_96dpi.png",
                                    "title": title,
                                    "title_link": link,
                                    "image_url": imgSrc,
                                    "ts": Date.now() / 1000
                                }
                            ]
                        };

                        var options = {
                            method: 'POST',
                            uri: WEBHOOK_URL,
                            body: msg,
                            json: true
                        };

                        rp(options)
                            .then(function (parsedBody){
                            })
                            .catch(function (err){
                            });
                    }
                });
        };

        this.handleDeleteRecordRequest = function (req, res){
            res.end();
        };

        this.tryLoad = function (cb){

            https.get(`https://pikabu.ru/search?t=${encodeURI("Кот")}&d=${pb.getPbToday()}`,
                function (res){
                    var chunks = [];
                    res.on('data', function (chunk){
                        chunks.push(chunk);
                    });
                    res.on('end', function (){
                        var decodedBody = iconv.decode(Buffer.concat(chunks), 'win1251');
                        var $ = cheerio.load(decodedBody, {decodeEntities: false})
                        let count = $('.stories-search__feed-panel > span').text();
                        let $lastArticle = $('article.story').first();
                        let lastArticleHeader = $lastArticle.find('.story__title').text();
                        let storySrc = $lastArticle.find('.story-image__content a').attr('href');
                        let imgSrc = $lastArticle.find('.story-image__content a img').attr('src');
                        console.log(count, lastArticleHeader, storySrc, imgSrc);

                        try {
                            cb(lastArticleHeader, storySrc, imgSrc);
                        } catch (err) {}
                    });
            });
        }

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