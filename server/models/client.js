'use strict';

var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
	cid: String,
	lastUpdate: Date,
	hostname: String,
	config: {},
	system: {},
	drives: {},
	hddtemp: [{}],
	services: [{}],
  metadata: {
    description: String
  }
});

var Client = mongoose.model('Client', clientSchema);
module.exports = Client;