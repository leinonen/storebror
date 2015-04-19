var ReportClient = require('./report-client');
var config = require('./config/slave-config');
var client = new ReportClient();

console.log('storebror client started. will send reports every %d s.', config.reportInterval / 1000);

client.on('report.sent', function (response) {
	console.log('report sent successfully.');
});

client.on('report.error', function (err) {
	//console.error(err);
	console.error('error connecting to master. retrying in %d s', config.reportInterval / 1000);
	//clearInterval(timer);
});

var timer = setInterval(client.report, config.reportInterval);

client.report();