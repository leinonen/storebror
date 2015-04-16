'use strict';

var mongoose = require('mongoose');

var reportSchema = mongoose.Schema({
	name: String,
	description: String
});

var Project = mongoose.model('Event', projectSchema);
module.exports = Project;