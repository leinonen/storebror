
exports.upload = function(req, res) {
	//console.log('post for upload');
	//console.log(req.headers);

	var info = req.body;

	console.log( info.hostname );
	res.json({status: 'ok'});

};