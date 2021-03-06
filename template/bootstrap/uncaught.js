
var logger = require('dagger.js/lib/logger');

exports = module.exports = function(opts) {
	process.on('uncaughtException', function(err) {
		logger.error(err.stack || err);
		if (opts.exitOnError) {
			process.exit(1);
		}
	});
};
