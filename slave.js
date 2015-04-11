var ReportClient = require('./report-client');

var client = new ReportClient();
var timer;


client.on('connected', function(client_id) {
	client.report(client_id);
	timer = setInterval(function(){
		client.report(client_id);
	}, 10000);
});

client.on('report.sent', function(response) {
	console.log('report sent: ' + response.status);
});

client.on('report.error', function(err) {
	console.error(err);
	clearInterval(timer);
});

client.connect();
