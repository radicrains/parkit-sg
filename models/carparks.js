const mongoose = require('mongoose');

////create schema//////
const carparkSchema = new mongoose.Schema({
	lotsAvailable: String,
	lotType: String,
    carparkNo: String,
	geometries: [Object],
});

////create model/////
const Carpark = mongoose.model('Carpark', carparkSchema);

////export/////
module.exports = Carpark;
