
var dagger     = require('dagger.js');
var models     = dagger.require('models');
var Endpoint   = dagger.require('endpoint');
var HttpError  = dagger.require('http-meta').HttpError;

var {{ modelName.class }} = models.require('{{ modelName.hyphen }}').model;

var {{ endpointName.class }}Endpoint = module.exports = new Endpoint({

	route: '/{{ endpointName.hyphen }}',

	// 
	// GET /{{ endpointName.hyphen }}/schema
	// 
	"get /schema": function(req) {
		req.send(200, {{ modelName.class }}.schemaDescription());
	},

	// 
	// GET /{{ endpointName.hyphen }}
	// 
	"get": function(req) {
		{{ modelName.class }}.findByQuery(req.query)
			.then(
				function(docs) {
					req.send(200, docs.map({{ modelName.class }}.serialize));
				},
				function(err) {
					(new HttpError(err)).send(req);
				}
			);
	},

	// 
	// GET /{{ endpointName.hyphen }}/:id
	// 
	"get /:id": function(req) {
		{{ modelName.class }}.findById(req.params.id).exec()
			.then(
				function(doc) {
					if (! doc) {
						return (new HttpError(404, 'Document not found')).send(req);
					}

					req.send(200, {{ modelName.class }}.serialize(doc));
				},
				function(err) {
					// This means that the param ID was not a valid ObjectId
					if (err.name === 'CastError' || err.path === '_id') {
						return (new HttpError(404, 'Document not found')).send(req);
					}

					(new HttpError(err)).send(req);
				}
			);
	},

	// 
	// POST /{{ endpointName.hyphen }}
	// 
	"post": function(req) {
		{{ modelName.class }}.create(req.body)
			.then(
				function(doc) {
					req.send(200, {{ modelName.class }}.serialize(doc));
				},
				function(err) {
					(new HttpError(err)).send(req);
				}
			);
	},

	// 
	// PUT/PATCH /{{ endpointName.hyphen }}
	// 
	"put|patch": function(req) {
		// 
	},

	// 
	// PUT/PATCH /{{ endpointName.hyphen }}/:id
	// 
	"put|patch /:id": function(req) {
		{{ modelName.class }}.findById(req.params.id).exec()
			.then(function(doc) {
				if (! doc) {
					return (new HttpError(404, 'Document not found')).send(req);
				}

				// 
				// NOTE: Any kind of authorization should be handled here
				// 

				doc.set(req.body);
				return when.saved(doc);
			})
			.then(
				function(doc) {
					req.send(200, doc);
				},
				function(err) {
					(new HttpError(err)).send(req);
				}
			);
	},

	// 
	// DELETE /{{ endpointName.hyphen }}
	// 
	"delete": function(req) {
		// 
	},

	// 
	// DELETE /{{ endpointName.hyphen }}/:id
	// 
	"delete /:id": function(req) {
		// 
	}

});
