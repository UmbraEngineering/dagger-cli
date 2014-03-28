
var dagger     = require('dagger.js');
var Endpoint   = dagger.require('endpoint');
var HttpError  = dagger.require('http-meta').HttpError;

var {{ endpointName.class }}Endpoint = module.exports = new Endpoint({

	route: '/{{ endpointName.hyphen }}',

	// 
	// GET /{{ endpointName.hyphen }}
	// 
	"get": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	},

	// 
	// POST /{{ endpointName.hyphen }}
	// 
	"post": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	},

	// 
	// PUT/PATCH /{{ endpointName.hyphen }}
	// 
	"put|patch": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	},

	// 
	// DELETE /{{ endpointName.hyphen }}
	// 
	"delete": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	}

});
