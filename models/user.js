const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	id          : {
		type     : Number,
		required : true
	},
	name        : {
		type     : String,
		required : true
	},
	email       : {
		type     : String,
		required : true
	},
	password    : {
		type     : String,
		required : true
	},
	firstAccess : {
		type    : Date,
		default : Date.now
	}
});

const userCollection = mongoose.model('user', userSchema);

module.exports = userCollection;
