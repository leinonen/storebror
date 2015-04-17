var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var controller = require('./master-controller');
var app        = express();
var expressWs  = require('express-ws')(app);
var config     = require('./config/master-config');

app.use(controller.logRequest);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/gui')));

// api for the user interface??
app.get('/clients', controller.clients);
app.get('/stats', controller.stats);
app.get('/config', controller.config);

// websocket routes
app.ws('/report', controller.report);


app.listen(config.port);

console.log('master started at port %d', config.port);