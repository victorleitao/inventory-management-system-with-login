const express = require('express');
const router = express.Router();
const productCollection = require('../models/product');
const categoryCollection = require('../models/category');

router.get('/', async (req, res) => {
	let filter = {};
	if (req.query.categories) {
		filter = { category: req.query.categories.split(',') };
	}

	const productList = await productCollection
		.find(filter)
		.populate('category')
		.select('-__v -dateCreated');

	if (!productList) {
		res.status(500).json({ success: false });
	}
	res.send(productList);
});

router.get('/search', async (req, res) => {
	const product = await productCollection.findOne({
		code : req.query.code
	});

	if (!product) {
		return res.status(404).json({
			success : false,
			message : 'Não existe produto com este Código.'
		});
	}

	res.status(200).send(product);
});

router.get('/:id', async (req, res) => {
	const product = await productCollection
		.findById(req.params.id)
		.populate('category');

	if (!product) {
		return res.status(404).json({
			success : false,
			message : 'Não existe produto com este ID.'
		});
	}
	res.status(200).send(product);
});

router.post('/', async (req, res) => {
	try {
		const category = await categoryCollection.findById(
			req.body.category
		);
		if (!category) {
			return res.status(400).json({
				success : false,
				message : 'Não existe categoria com este ID.'
			});
		}

		const existingCode = await productCollection.findOne({
			code : req.body.code
		});
		if (existingCode) {
			return res.status(400).json({
				success : false,
				message :
					'Já existe um produto cadastrado sob este código.'
			});
		}

		const newProduct = {
			name         : req.body.name,
			description  : req.body.description,
			code         : req.body.code,
			price        : req.body.price,
			category     : req.body.category,
			countInStock : req.body.countInStock
		};

		await productCollection.insertMany(newProduct);

		const newRegister = await productCollection.findOne({
			code : req.body.code
		});

		return res.status(201).json({
			success : true,
			message : 'Produto cadastrado com sucesso.',
			id      : newRegister.id
		});
	} catch (error) {
		return res.status(404).json({
			success : false,
			error   : error
		});
	}
});

router.put('/:id', async (req, res) => {
	try {
		const category = await categoryCollection.findById(
			req.body.category
		);
		if (!category) {
			return res.status(400).json({
				success : false,
				message : 'Não existe categoria com este ID.'
			});
		}

		const existingCode = await productCollection.findOne({
			code : req.body.code
		});
		if (req.params.id !== existingCode.id) {
			if (existingCode) {
				return res.status(400).json({
					success : false,
					message :
						'Já existe um produto cadastrado sob este código.'
				});
			}
		}

		const product = await productCollection.findByIdAndUpdate(
			req.params.id,
			{
				name         : req.body.name,
				description  : req.body.description,
				code         : req.body.code,
				price        : req.body.price,
				// image        : req.body.image,
				category     : req.body.category,
				countInStock : req.body.countInStock
			},
			{ new: true }
		);

		if (!product) {
			return res.status(404).json({
				success : false,
				message : 'Produto não existe.'
			});
		}
		res.status(200).send(product);
	} catch (error) {
		return res.status(400).json({
			success : false,
			error   : error
		});
	}
});

router.delete('/:id', (req, res) => {
	productCollection
		.findByIdAndRemove(req.params.id)
		.then(product => {
			if (product) {
				return res.status(200).json({
					success : true,
					message : 'Produto removido.'
				});
			} else {
				return res.status(404).json({
					success : false,
					message : 'Produto não existe.'
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

router.get('/get/count', async (req, res) => {
	const productCount = await productCollection.countDocuments();

	if (!productCount) {
		return res.status(404).json({
			success : false,
			message : 'Ocorreu um erro na contagem.'
		});
	}
	res.status(200).send({ productCount: productCount });
});

const productRouter = router;

module.exports = productRouter;
