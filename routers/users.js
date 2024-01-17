const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userCollection = require('../models/user');

router.post('/', async (req, res) => {
	try {
		const saltRounds = 10;
		const hashedPassword = await bcrypt.hash(
			req.body.password,
			saltRounds
		);
		const data = {
			id          : Date.now().toString(),
			name        : req.body.name,
			email       : req.body.email,
			password    : hashedPassword,
			firstAccess : Date.now()
		};

		const existingUser = await userCollection.findOne({
			name : data.name
		});
		const existingEmail = await userCollection.findOne({
			email : data.email
		});

		if (existingUser || existingEmail) {
			res.redirect('/registererror');
		} else {
			await userCollection.insertMany(data);
			res.redirect('/goodregister');
		}
	} catch (error) {
		res.redirect('/');
	}
});

const userRouter = router;

module.exports = userRouter;
