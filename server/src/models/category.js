const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	name  : {
		type     : String,
		required : true
	},
	code  : {
		type     : Number,
		required : true
	},
	color : {
		type     : String,
		required : true
	}
});

const categoryCollection = mongoose.model('categories', categorySchema);

module.exports = categoryCollection;
