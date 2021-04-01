const mongoose = require('mongoose');

////create schema//////
const commentsSchema = new mongoose.Schema({
	user: String,
    comment: String
});

////create model/////
const Comments = mongoose.model('Comments', commentsSchema);

////export/////
module.exports = Comments;
