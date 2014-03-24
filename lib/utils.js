
var fs          = require('fs');
var path        = require('path');
var handlebars  = require('handlebars');

var cwd = process.cwd();

global.output = function output(str) {
	process.stdout.write(str);
}

global.output.error = function(str) {
	process.strerr.write(str);
};

global.copyFile = function copyFile(from, to) {
	fs.writeFileSync(to, fs.readFileSync(from));
};

global.copyFromTemplate = function copyFromTemplate(file) {
	var from  = path.join(__dirname, '../template', file);
	var to    = path.join(cwd, file);

	copyFile(from, to);
};

global.renderFromTemplate = function(from, to, data) {
	from  = path.join(__dirname, '../template', from);
	to    = path.join(cwd, to);

	fs.writeFileSync(to, render(fs.readFileSync(from, 'utf8'), data));
};

global.mkdir = function mkdir(dir) {
	try {
		fs.mkdirSync(dir);
	} catch (err) {
		if (err.message.indexOf('EEXIST') !== 0) {
			throw err;
		}
	}
};

global.render = function(content, data) {
	return handlebars.compile(content)(data);
};
