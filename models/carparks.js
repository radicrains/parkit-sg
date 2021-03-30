const mongoose = require('mongoose');

////create schema//////
const carparkSchema = new mongoose.Schema({
	short_term_parking: String,
	car_park_type: String,
    y_coord: String,
	x_coord: String,
	free_parking: String,
	gantry_height: String,
	car_park_basement: String,
	night_parking: String,
	address: String,
	car_park_decks: String,
	car_park_no: String,
	type_of_parking_system: String,
});

////create model/////
const Carpark = mongoose.model('Carpark', carparkSchema);

////export/////
module.exports = Carpark;
