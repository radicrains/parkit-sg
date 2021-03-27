const express = require('express');
const carpark = express.Router();
const Carparks = require('../models/carparks');

///////////////////////////////////////////////////////////////////////////////////

////// Create //////
carpark.post('/', (req, res) => {
	Carparks.create(req.body, (err, createdCarpark) => {
		if (err) console.log(err);
		if (createdCarpark) {
			console.log(createdCarpark);
			res.json(createdCarpark);
		}
	});
});

////// Read //////
carpark.get('/', (req, res) => {
	Carparks.find({}, (err, foundCarpark) => {
		if (err) console.log(err);
		if (foundCarpark) {
			console.log(foundCarpark);
			res.json(foundCarpark);
		}
	});
});

////// Update //////
carpark.put('/:id', (req, res) => {
	Carparks.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedCarpark) => {
			if (err) console.log(err);
			if (updatedCarpark) {
				console.log(updatedCarpark);
				res.json(updatedCarpark);
			}
		}
	);
});

////// Delete //////
carpark.delete('/:id', (req, res) => {
	Carparks.findByIdAndRemove(req.params.id, (err, deletedCarpark) => {
		if (err) console.log(err);
		if (deletedCarpark) {
			console.log(deletedCarpark);
			res.json(deletedCarpark);
		}
	});
});

module.exports = carpark;
