
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
					// 
					// NOTE: Authorization should occur here
					// 

					req.send(200, docs.map({{ modelName.class }}.serialize));
				},
				HttpError.catch(req)
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

					// 
					// NOTE: Authorization should occur here
					// 

					req.send(200, {{ modelName.class }}.serialize(doc));
				},
				HttpError.catch(req)
			);
	},

	// 
	// POST /{{ endpointName.hyphen }}
	// 
	"post": function(req) {
		// 
		// NOTE: Authorization should occur here
		// 

		{{ modelName.class }}.create(req.body)
			.then(
				function(doc) {
					req.send(200, {{ modelName.class }}.serialize(doc));
				},
				HttpError.catch(req)
			);
	},

	// 
	// PUT/PATCH /{{ endpointName.hyphen }}
	// 
	"put|patch": function(req) {
		var objs = req.body;

		if (! Array.isArray(objs)) {
			return (new HttpError(400, 'Expected an array of objects to update in the body')).send(req);
		}

		// Get only the doc ids
		var ids = objs.map(function(obj) {
			return obj._id;
		});

		// Fetch all of the needed docs
		{{ modelName.class }}.find({ _id: {$in: ids} }).exec()
			.then(function(docs) {
				if (! docs || docs.length < objs.length) {
					throw new HttpError(404, 'Some documents could not be found');
				}

				// 
				// NOTE: Authorization should occur here
				// 

				objs.forEach(function(obj) {
					var doc = docs.find(function(doc) {
						return doc.id === obj._id;
					});

					doc.set(obj);
				});

				return when.saved(docs);
			})
			.then(
				function(docs) {
					req.send(200, docs.map({{ modelName.class }}.serialize));
				},
				HttpError.catch(req)
			);
	},

	// 
	// PUT/PATCH /{{ endpointName.hyphen }}/:id
	// 
	"put|patch /:id": function(req) {
		{{ modelName.class }}.findById(req.params.id).exec()
			.then(function(doc) {
				if (! doc) {
					throw new HttpError(404, 'Document not found');
				}

				// 
				// NOTE: Any kind of authorization should be handled here
				// 

				doc.set(req.body);
				return when.saved(doc);
			})
			.then(
				function(doc) {
					req.send(200, {{ modelName.class }}.serialize(doc));
				},
				HttpError.catch(req)
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
