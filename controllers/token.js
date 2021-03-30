const express = require('express');
const token= express.Router();
const Token = require('../models/token');

///////////////////////////////////////////////////////////////////////////////////

////// Create //////
token.post('/', (req, res) => {
	Token.create(req.body, (err, createdToken) => {
		if (err) console.log(err);
		if (createdToken) {
			console.log(createdToken);
			res.json(createdToken);
		}
	});
});

////// Read //////
token.get('/', (req, res) => {
	Token.find({}, (err, foundToken) => {
		if (err) console.log(err);
		if (foundToken) {
			console.log(foundToken);
			res.json(foundToken);
		}
	});
});

////// Update //////
token.put('/:id', (req, res) => {
	Token.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedToken) => {
			if (err) console.log(err);
			if (updatedToken) {
				console.log(updatedToken);
				res.json(updatedToken);
			}
		}
	);
});

////// Delete //////
token.delete('/:id', (req, res) => {
	Token.findByIdAndRemove(req.params.id, (err, deletedToken) => {
		if (err) console.log(err);
		if (deletedToken) {
			console.log(deletedToken);
			res.json(deletedToken);
		}
	});
});

module.exports = token;
