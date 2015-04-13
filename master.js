var express    = require('express');
var path       = require('path');
var bodyParser = require('body-parser');
var controller = require('./master-controller');
var app        = express();
var expressWs  = require('express-ws')(app);
var config     = require('./master-config.json');
var port       = process.env.PORT || config.port;

app.use(controller.logRequest);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/gui')));

// api for the user interface??
//app.post('/connect', controller.connect);
//app.post('/clients/:cid/sysinfo', controller.sysinfo);
app.get('/clients', controller.clients);
app.get('/stats', controller.stats);
app.get('/config', controller.config);

// websocket routes
app.ws('/connect', controller.connect);
app.ws('/report', controller.report);


app.listen(port);

console.log('master started at port %d', port);