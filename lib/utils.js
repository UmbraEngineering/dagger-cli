
var fs          = require('fs');
var path        = require('path');
var cp          = require('child_process');
var handlebars  = require('handlebars');

var cwd = process.cwd();

global.output = function output(str) {
	process.stdout.write(str);
}

global.output.error = function(str) {
	process.stderr.write(str);
};

global.copyFile = function(from, to) {
	fs.writeFileSync(to, fs.readFileSync(from));
};

global.templateFile = function(file, force) {
	if (force) {
		if (force === 'global') {
			return path.join(__dirname, '../template', file);
		} else if (force === 'local') {
			return path.join(cwd, '.dagger/templates', file);
		}
	}

	if (fileExists('.dagger/templates/' + file)) {
		return path.join(cwd, '.dagger/templates', file);
	}

	return path.join(__dirname, '../template', file);
};

global.appFile = function(file) {
	return path.join(cwd, file);
};

global.copyFromTemplate = function(file, toFile) {
	var from  = templateFile(file);
	var to    = path.join(cwd, (toFile || file));

	copyFile(from, to);
};

global.createLocalTemplate = function(from, to) {
	var dir = cwd;
	
	// This should recursively create all of the needed directories to reach the file and end with
	// the dir variable being the full path to the deepest created directory
	['.dagger', 'templates'].concat(to.split('/').slice(0, -1)).forEach(function(subDir) {
		dir = path.join(dir, subDir);
		mkdir(dir);
	});

	copyFile(from, templateFile(to, 'local'));
};

global.renderFile = function(from, to, data) {
	fs.writeFileSync(to, render(fs.readFileSync(from, 'utf8'), data));
};

global.mkdir = function(dir) {
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

global.fileExists = function(file) {
	return fs.existsSync(path.resolve(cwd, file));
};

global.deleteFile = function(file) {
	fs.unlinkSync(path.join(cwd, file));
};

global.editFile = function(file, editor) {
	editor = editor || process.env.EDITOR || process.env.VISUAL || 'vi';
	cp.spawn(editor, [file]);
};
