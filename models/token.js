const mongoose = require('mongoose');

////create schema//////
const tokenSchema = new mongoose.Schema({
	token: String,
});

////create model/////
const Token = mongoose.model('Token', tokenSchema);

////export/////
module.exports = Token;
