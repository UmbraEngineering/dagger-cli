
var models = require('dagger.js/lib/models');
{{#if needsObjectId }}
var ObjectId = models.types.ObjectId;
{{/if}}

// 
// Define the {{ name.class }} schema
// 
// There is no need to create the actual model here (eg. `mongoose.model('{{ name.class }}', {{ name.class }}Schema)`)
// as that is handled automatically by dagger's model module.
// 
var {{ name.class }}Schema = module.exports = new models.Schema({
	{{#each fields }}{{ this.name }}: { type: {{ this.type }} }{{#unless @last}},
	{{/unless}}{{/each}}
});
