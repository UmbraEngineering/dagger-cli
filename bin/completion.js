
var fs      = require('fs');
var path    = require('path');
var tabtab  = require('tabtab');

// Handle bash completion
if (process.argv[2] === 'completion') {
	// Patch for path.exists because tabtab has not updated
	require('exists-patch').patchBackward();

	return tabtab.complete('dagger', function(err, data) {
		if (err || ! data) {
			return;
		}

		// Sub-command flags/options
		if (data.words >= 2) {
			switch (data.line.split(' ')[1]) {
				case 'config':
					if (options(data, ['g', 'l', 'e', 'n', 'f'], ['global', 'local', 'editor', 'name', 'from'])) {
						return;
					}
				break;
			}
		}

		// Top-level flags/options
		if (options(data, ['h', 'V'], ['help', 'version'])) {
			return;
		}

		// Sub-commands
		if (data.words === 1) {
			return tabtab.log(['init', 'create', 'destroy', 'completion', 'config'], data);
		}

		// Sub-sub-commands
		if (data.words === 2) {
			switch (data.prev) {
				case 'init':
					return options(data, ['d'], ['deps']);
				break;

				case 'create':
					return tabtab.log([ 'model', 'endpoint', 'middleware', 'bootstrap' ], data);
				break;

				case 'destroy':
					return tabtab.log([ 'model', 'endpoint', 'middleware', 'bootstrap' ], data);
				break;

				case 'completion':
					return tabtab.log([ 'install', 'uninstall' ], data);
				break;

				case 'config':
					return tabtab.log([ 'template' ], data);
				break;
			}
		}

		// File completion
		if (data.words === 3) {
			switch (data.prev) {
				case 'model':
					return tabtab.log(jsFiles('models'), data);
				break;

				case 'endpoint':
					return tabtab.log(jsFiles('endpoints'), data);
				break;

				case 'middleware':
					return tabtab.log(jsFiles('middleware'), data);
				break;

				case 'bootstrap':
					return tabtab.log(jsFiles('bootstrap'), data);
				break;
			}
		}
	});
}

// 
// Handle auto-completion of options/flags
// 
function options(data, singles, doubles) {
	if (/^--\w?/.test(data.last)) {
		tabtab.log(doubles, data, '--');
		return true;
	}

	if (/^-\w?/.test(data.last)) {
		tabtab.log(singles, data, '-');
		return true;
	}
}

// 
// Handle auto-completion of .js files in a directory
// 
function jsFiles(dir) {
	var files = [ ];

	fs.readdirSync(path.join(process.cwd(), dir)).forEach(function(file) {
		if (file.slice(-3) === '.js') {
			files.push(file.slice(0, -3));
		}
	});

	return files;
}
