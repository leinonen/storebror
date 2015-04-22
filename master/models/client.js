'use strict';

var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
	cid: String,
	lastUpdate: Date,
	hostname: String,
	drives: [{}],
	hddtemp: [{}],
	services: [{}],
	system: [{}]
});

var Client = mongoose.model('Client', clientSchema);
module.exports = Client;