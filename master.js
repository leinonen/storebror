var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var controller = require('./master-controller');

// log all requests
app.use(controller.log);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/connect', controller.connect);

app.post('/report', controller.report);

app.get('/clients', controller.clients);


app.listen(8080);

console.log('master started at port 8080');