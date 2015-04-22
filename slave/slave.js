var ReportClient = require('./report-client');
var config = require('./config/slave-config');
var client = new ReportClient();
var retries = 0;

var timer = setInterval(client.report, config.reportInterval);

console.log('storebror client started. will send reports every %d s.', config.reportInterval / 1000);

client.on('report.sent', function (response) {
	console.log(response.status);
});

client.on('report.error', function (err) {
	//console.error(err);
	console.error('error connecting to master. retrying in %d s', config.reportInterval / 1000);
	retries++;
	if (tries > 20) {
		console.log('this is boring, going to sleep instead');
		clearInterval(timer);
	}
});

client.report();