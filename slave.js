var ReportClient = require('./report-client');

var client = new ReportClient();

var timer;

function startTimer() {
	timer = setInterval(function(){
		client.report(client_id);
	}, 10000);
}

client.on('connected', function(client_id) {
	client.report(client_id);
	startTimer();
});

client.on('report.sent', function(response) {
	console.log('report sent: ' + response.status);
});

client.on('report.error', function(err) {
	console.error(err);
	clearInterval(timer);
});

client.connect();
