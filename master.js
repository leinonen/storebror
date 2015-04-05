var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var controller = require('./master-controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req,res,next){
	console.log(req.originalUrl);
	next();
});

app.post('/report', controller.report);

app.get('/clients', controller.clients);


app.listen(8080);

console.log('master started at port 8080');