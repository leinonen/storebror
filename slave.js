var ReportClient = require('./report-client');
var config = require('./slave-config.json');
var client = new ReportClient();

client.on('report.sent', function(response) {
	console.log('report sent: ' + response.status);
});

client.on('report.error', function(err) {
	console.error(err);
	clearInterval(timer);
});

var timer = setInterval(function(){
	client.report();
}, config.reportInterval);
