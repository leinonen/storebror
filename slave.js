var ReportClient = require('./report-client');

var client = new ReportClient();

client.on('connected', function(client_id) {
	client.report(client_id);
});

client.on('report.sent', function(response) {
	console.log('report sent: ' + response.status);
});

client.on('report.error', function(err) {
	console.error(err);
});

client.connect();
