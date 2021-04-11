const express = require('express');
const carpark = express.Router();
const Carparks = require('../models/carparks');

///////////////////////////////////////////////////////////////////////////////////

////// Create //////
carpark.post('/', (req, res) => {
	Carparks.create(req.body, (err, createdCarpark) => {
		if (err) {
            res.status(400).json({message: 'post not successful'})
        };
		if (createdCarpark) {
			console.log(createdCarpark);
			res.json(createdCarpark);
		}
	});
});

////// Read //////
carpark.get('/', (req, res) => {
	Carparks.find({}, (err, foundCarpark) => {
		if (err) {
            res.status(400).json({message: 'get not successful'})
        };
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
			if (err) {
            res.status(400).json({message: 'put not successful'})
        };
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
		if (err) {
            res.status(400).json({message: 'delete not successful'})
        };
		if (deletedCarpark) {
			console.log(deletedCarpark);
			res.json(deletedCarpark);
		}
	});
});

module.exports = carpark;
