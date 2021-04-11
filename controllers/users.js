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
		if (err) {
            res.status(400).json({message: 'post not successful'})
        };
		if (createdUsers) {
			console.log(createdUsers);
			// res.json(createdUsers);
		}
	});
});

////// Read //////
users.get('/', (req, res) => {
	User.find({}, (err, foundUsers) => {
		if (err) {
            res.status(400).json({message: 'get not successful'})
        };
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
			if (err) {
            res.status(400).json({message: 'put not successful'})
        };
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
		if (err) {
            res.status(400).json({message: 'delete not successful'})
        };
		if (deletedUsers) {
			console.log(deletedUsers);
			res.json(deletedUsers);
		}
	});
});

module.exports = users;
