const mongoose = require('mongoose');
const connect = mongoose.connect(process.env.DATABASE_URL);

// Check database connection
connect
	.then(() => {
		console.log('Database connected successfully.');
	})
	.catch(() => {
		console.log('Database connection failed.');
	});

const loginSchema = new mongoose.Schema({
	id       : {
		type     : String,
		required : true
	},
	name     : {
		type     : String,
		required : true
	},
	email    : {
		type     : String,
		required : true
	},
	password : {
		type     : String,
		required : true
	}
});

const collection = new mongoose.model('users', loginSchema);

module.exports = collection;
