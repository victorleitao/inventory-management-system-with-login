const express = require('express');
const router = express.Router();
const categoryCollection = require('../models/category');

router.get('/', async (req, res) => {
	const categoryList = await categoryCollection.find();

	if (!categoryList) {
		res.status(500).json({ success: false });
	}
	res.status(200).send(categoryList);
});

router.get('/:id', async (req, res) => {
	const category = await categoryCollection.findById(req.params.id);

	if (!category) {
		return res.status(404).json({
			success : false,
			message : 'Não existe categoria com este ID.'
		});
	}
	res.status(200).send(category);
});

router.post('/', async (req, res) => {
	try {
    const newCategory = {
      name  : req.body.name,
			code  : req.body.code,
			color : req.body.color
		};

		const existingCategory = await categoryCollection.findOne({
			name : newCategory.name
		});
		const existingCode = await categoryCollection.findOne({
			code : newCategory.code
		});

		if (existingCategory || existingCode) {
			return res.status(404).json({
				success : false,
				message : 'Categoria já existe.'
			});
		} else {
			await categoryCollection.insertMany(newCategory);
			return res.status(200).json({
				success : true,
				message : 'Categoria cadastrada com sucesso.'
			});
		}
	} catch (error) {
		return res.status(400).json({
			success : false,
			error   : error
		});
	}
});

router.put('/:id', async (req, res) => {
	try {
		const category = await categoryCollection.findByIdAndUpdate(
			req.params.id,
			{
				name  : req.body.name,
				code  : req.body.code,
				color : req.body.color
			},
			{ new: true }
		);

		if (!category) {
			return res.status(400).json({
				success : false,
				message : 'Categoria não existe.'
			});
		}
		res.status(200).send(category);
	} catch (error) {
		return res.status(400).json({
			success : true,
			error   : err
		});
	}
});

router.delete('/:id', (req, res) => {
	categoryCollection
		.findByIdAndRemove(req.params.id)
		.then(category => {
			if (category) {
				return res.status(200).json({
					success : true,
					message : 'Categoria removida.'
				});
			} else {
				return res.status(404).json({
					success : false,
					message : 'Categoria não existe.'
				});
			}
		})
		.catch(err => {
			return res.status(400).json({
				success : true,
				error   : err
			});
		});
});

const categoryRouter = router;

module.exports = categoryRouter;
