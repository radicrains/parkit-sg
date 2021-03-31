const bcrypt = require('bcrypt');
const express = require('express');
const users= express.Router();
const User = require('../models/users');

///////////////////////////////////////////////////////////////////////////////////

////// Create //////
users.post('/', (req, res) => {
	req.body.password = bcrypt.hashSync(
		req.body.password,
		bcrypt.genSaltSync(10)
	);
	User.create(req.body, (err, createdUsers) => {
		if (err) console.log(err);
		if (createdUsers) {
			console.log(createdUsers);
			// res.json(createdUsers);
		}
	});
});

////// Read //////
users.get('/', (req, res) => {
	User.find({}, (err, foundUsers) => {
		if (err) console.log(err);
		if (foundUsers) {
			console.log(foundUsers);
			res.json(foundUsers);
		}
	});
});

////// Update //////
users.put('/:id', (req, res) => {
	users.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedUsers) => {
			if (err) console.log(err);
			if (updatedUsers) {
				console.log(updatedUsers);
				res.json(updatedUsers);
			}
		}
	);
});

////// Delete //////
users.delete('/:id', (req, res) => {
	users.findByIdAndRemove(req.params.id, (err, deletedUsers) => {
		if (err) console.log(err);
		if (deletedUsers) {
			console.log(deletedUsers);
			res.json(deletedUsers);
		}
	});
});

module.exports = users;
