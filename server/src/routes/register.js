const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
const userCollection = require('../models/user');

router.post('/', async (req, res) => {
	try {
		// const saltRounds = 10;
		// const hashedPassword = await bcrypt.hash(
		// 	req.body.password,
		// 	saltRounds
		// );
		const data = {
			id          : Date.now().toString(),
			name        : req.body.name,
			email       : req.body.email,
			// PASSWORD NÃO ENCRIPTADO
			password    : req.body.password,
			firstAccess : Date.now()
		};

		const existingUser = await userCollection.findOne({
			name : data.name
		});
		const existingEmail = await userCollection.findOne({
			email : data.email
		});

		if (existingUser || existingEmail) {
			return res.status(400).json({
				success : false,
				message : 'Usuário ou e-mail já existem no banco de dados.'
			});
		} else {
			await userCollection.insertMany(data);
			return res.status(200).json({
				success : true,
				message : 'Usuário cadastrado com sucesso.'
			});
		}
	} catch (error) {
		return res.status(400).json({
			success : true,
			error   : err
		});
	}
});

const registerRouter = router;

module.exports = registerRouter;
