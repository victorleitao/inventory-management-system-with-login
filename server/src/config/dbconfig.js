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
