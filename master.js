// master
// get data from the slaves
// save to database

// serve requests for GUI via rest interface

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var controller = require('./master-controller');

app.use(bodyParser.json());

app.post('/upload', controller.upload);

app.listen(8080);

console.log('master started at port 8080');