var ReportClient = require('./report-client');
var config = require('./slave-config.json');
var client = new ReportClient();
var timer;


client.on('connected', function(client_id) {
	client.report(client_id);
	timer = setInterval(function(){
		client.report(client_id);
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
