const express = require('express');

const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
	const { limit, orderby, sortdir } = req.query;

	let order = orderby || 'id';

	db.select('*')
		.from('accounts')
		.orderBy(order, sortdir)
		.limit(limit)
		.then((budget) => {
			res.status(200).json(budget);
		})
		.catch((err) => {
			res.status(500).json({ message: 'error fetching budget', err });
		});
});

router.get('/:id', (req, res) => {
	const { id } = req.params;

	db.select('*')
		.from('accounts')
		.where({ id })
		.first()
		.then((account) => {
			account ? res.status(200).json(account) : res.status(400).json({ message: 'Account not found!' });
		})
		.catch((err) => {
			res.status(500).json({ message: 'error fetching budget', err });
		});
});

router.post('/', async (req, res) => {
	const accountData = req.body;

	try {
		const account = await db.insert(accountData).into('accounts');
		res.status(201).json(account);
	} catch (err) {
		res.status(500).json({ message: 'db problem', error: err });
	}
});

router.put('/:id', (req, res) => {
	const { id } = req.params;
	const accountData = req.body;

	db.select('*')
		.from('accounts')
		.where({ id })
		.update(accountData)
		.then((account) => {
			account ? res.status(200).json({ updated: account }) : res.status(404).json({ message: 'invalid id' });
		})
		.catch((err) => {
			res.status(500).json({ message: 'db problem' });
		});
});

router.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const account = await db.del().from('accounts').where({ id });
		account ? res.status(200).json({ deleted: account }) : res.status(404).json({ message: 'invalid id' });
	} catch (err) {
		res.status(500).json({ message: 'database error', error: err });
	}
});

module.exports = router;
