
var Endpoint   = require('dagger.js/lib/endpoint');
var HttpError  = require('dagger.js/lib/http-meta').HttpError;

var {{ endpointName.class }}Endpoint = module.exports = new Endpoint({

	route: '/{{ endpointName.hyphen }}',
	{{#each methods}}
	//
	// {{upper this}} /{{ ../endpointName.hyphen }}
	//
	"{{ this }}": function(req) {
		(new HttpError(405, 'Endpoint not configured')).send(req);
	}{{#unless @last}},{{/unless}}
	{{/each}}
});
