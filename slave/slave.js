var ReportClient = require('./report-client');
var config = require('./config/slave-config');
var client = new ReportClient();
var retries = 0;

var timer = setInterval(client.report, config.reportInterval);

console.log('storebror client started. will send reports every %d s.', config.reportInterval / 1000);

client.on('report.sent', function (response) {
	console.log(response.status);
});

// general error
client.on('report.error', function (err) {
	console.log(err);
});

// websocket error
client.on('report.ws.error', function (err) {
	console.error('error connecting to master. retrying in %d s', config.reportInterval / 1000);
	retries++;
	if (retries > 20) {
		console.log('this is boring, going to sleep instead');
		clearInterval(timer);
	}
});

client.report();

