
var models     = require('dagger.js/lib/models');
var Endpoint   = require('dagger.js/lib/endpoint');
var HttpError  = require('dagger.js/lib/http-meta').HttpError;
var conf       = require('dagger.js/lib/conf');
var when       = require('dagger.js/node_modules/when');

var {{ modelName.class }} = models.require('{{ modelName.hyphen }}').model;

var {{ endpointName.class }}Endpoint = module.exports = new Endpoint({

	route: '/{{ endpointName.hyphen }}',

	// 
	// GET /{{ endpointName.hyphen }}/schema
	// 
	"get /schema": function(req) {
		if (! conf.output.schemaEndpoints) {
			return (new HttpError(404, 'Cannot get ' + req.pathname)).send(req);
		}
		req.respond(200, {{ modelName.class }}.schemaDescription());
	},

	// 
	// GET /{{ endpointName.hyphen }}
	// 
	"get": function(req) {
		{{ modelName.class }}.findByQuery(req.query)
			.then(
				function(docs) {
					// 
					// NOTE: Authorization should be done here
					// 

					req.respond(200, docs.map({{ modelName.class }}.serialize));
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
					// NOTE: Authorization should be done here
					// 

					req.respond(200, {{ modelName.class }}.serialize(doc));
				},
				HttpError.catch(req)
			);
	},

	// 
	// POST /{{ endpointName.hyphen }}
	// 
	"post": function(req) {
		// 
		// NOTE: Authorization should be done here
		// 

		{{ modelName.class }}.create(req.body)
			.then(
				function(doc) {
					req.respond(201, {{ modelName.class }}.serialize(doc));
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
				// NOTE: Authorization should be done here
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
					req.respond(200, docs.map({{ modelName.class }}.serialize));
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
				// NOTE: Authorization should be done here
				// 

				doc.set(req.body);
				return when.saved(doc);
			})
			.then(
				function(doc) {
					req.respond(200, {{ modelName.class }}.serialize(doc));
				},
				HttpError.catch(req)
			);
	},

	// 
	// DELETE /{{ endpointName.hyphen }}
	// 
	"delete": function(req) {
		var ids = req.body;
		var ignoreMissing = req.query.ignoreMissing;

		if (! Array.isArray(ids)) {
			return (new HttpError(400, 'Expected an array of ObjectIds')).send(req);
		}

		{{ modelName.class }}.find({ _id: {$in: ids} }).exec()
			.then(function(docs) {
				if (! ignoreMissing && (! docs || docs.length < ids.length)) {
					throw new HttpError(404, 'Some documents could not be found');
				}

				if (! docs) {
					return when.resolve();
				}

				// 
				// NOTE: Authorization should be done here
				// 

				docs.forEach(function(doc) {
					doc.remove();
				});

				return when.resolve();
			})
			.then(
				function() {
					req.respond(200);
				},
				HttpError.catch(req)
			);
	},

	// 
	// DELETE /{{ endpointName.hyphen }}/:id
	// 
	"delete /:id": function(req) {
		var ignoreMissing = req.query.ignoreMissing;

		{{ modelName.class }}.findById(req.params.id).exec()
			.then(function(doc) {
				if (! doc) {
					if (ignoreMissing) {
						return when.resolve();
					} else {
						throw new HttpError(404, 'Document not found');
					}
				}

				// 
				// NOTE: Authorization should be done here
				// 

				doc.remove();

				return when.resolve();
			})
			.then(
				function() {
					req.respond(200);
				},
				HttpError.catch(req)
			);
	}

});
