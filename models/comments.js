const mongoose = require('mongoose');

////create schema//////
const commentsSchema = new mongoose.Schema({
	car_park_no: String,
    user: String,
    comment: String,
    
});

////create model/////
const Comments = mongoose.model('Comments', commentsSchema);

////export/////
module.exports = Comments;
