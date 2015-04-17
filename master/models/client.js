'use strict';

var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
	cid: String,
	data: {}
});

var Client = mongoose.model('Client', clientSchema);
module.exports = Client;