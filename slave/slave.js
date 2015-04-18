var ReportClient = require('./report-client');
var config = require('./config/slave-config');
var client = new ReportClient();

console.log('storebror client started. will send reports every %d ms.', config.reportInterval);

client.on('report.sent', function (response) {
	//console.log('report sent: ' + response.status);
});

client.on('report.error', function (err) {
	//console.error(err);
	console.error('error connecting to master. terminating.');
	clearInterval(timer);
});

var timer = setInterval(function () {
	client.report();
}, config.reportInterval);

client.report();