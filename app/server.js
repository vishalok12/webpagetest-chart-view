"use strict";

var express = require('express');
var app = express();
var config = require('../config');
var PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
    // get all data fields
    var fields = getAllFields();

    res.render('index', {
        fields: fields,
        urls: config.url
    });
});

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/dist'));
app.use(express.static(__dirname + '/public'));

var server = app.listen(PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

function getAllFields() {
    return config.viewFields;
}
