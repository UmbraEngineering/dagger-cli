
var hb = require('handlebars');

// --------------------------------------------------------

hb.registerHelper('upper', function(text, opts) {
	return text.toUpperCase();
});
