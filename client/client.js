var ReportClient = require('./report-client');
var config = require('./config');
var client = new ReportClient();
var retries = 0;
var timer = null;


function handleError(err) {
	console.log(err);
	console.error('error connecting to master. retrying in %d s', config.reportInterval / 1000);
	retries++;
	if (retries > 20) {
		console.log('this is boring, going to sleep instead');
		clearInterval(timer);
	}
}

client.on('connect.success', function(msg){
	client.clientID = msg.id;
	console.log('connect successful: ' + client.clientID);
	timer = setInterval(client.report, config.reportInterval);
	// Send report immediately
	client.report();
});

client.on('report.sent', function (response) {
	console.log('sent %s report to master', response.type);
});

client.on('connect.error', handleError);
client.on('report.error', handleError);


console.log('storebror client started. will send reports every %d s.', config.reportInterval / 1000);
client.connect();

