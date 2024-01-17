const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	name         : {
		type     : String,
		required : true
	},
	description  : {
		type     : String,
		required : true
	},
	code         : {
		type     : Number,
		required : true
	},
	price        : {
		type     : Number,
		required : true
	},
	image        : {
		type    : String,
		default : ''
	},
	category     : {
		type     : mongoose.Schema.Types.ObjectId,
		ref      : 'categories',
		required : true
	},
	countInStock : {
		type : Number,
		// required : true,
		min  : 0
	},
	dateCreated  : {
		type    : Date,
		default : Date.now
	}
});

const productCollection = mongoose.model('products', productSchema);

module.exports = productCollection;
