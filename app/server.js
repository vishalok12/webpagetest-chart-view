"use strict";

var express = require('express');
var app = express();
var config = require('../config');

app.get('/', function (req, res) {
  res.render('index', {
      urls: config.url
  });
});

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/public'));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
