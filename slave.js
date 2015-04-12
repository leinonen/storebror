var ReportClient = require('./report-client');
var config = require('./slave-config.json');
var client = new ReportClient();
var timer;


client.on('connected', function(cid) {
	client.report(cid);
	timer = setInterval(function(){
		client.report(cid);
	}, config.reportInterval);
});

client.on('report.sent', function(response) {
	console.log('report sent: ' + response.status);
});

client.on('report.error', function(err) {
	console.error(err);
	clearInterval(timer);
});

client.connect();
