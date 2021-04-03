const express = require('express');
const comment = express.Router();
const Comments = require('../models/comments');

//CREATE
comment.post('/', (req, res) => {
    Comments.create(req.body, (err, createdComments) => {
        if (err) console.log(err.message);
        if (createdComments) {
            console.log(createdComments);
            res.json(createdComments);
        }
    });
});

//READ
comment.get('/', (req, res) => {
    Comments.find({}, (err, foundComment) => {
        if (err) console.log(err.message);
        if (foundComment) {
            console.log(foundComment);
            res.json(foundComment);
        }
    });
});

//UPDATE
comment.put('/:id', (req, res) => {
    Comments.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedComment) => {
        if (err) console.log(err.message);
        if (updatedComment) {
            console.log(updatedComment);
            res.json(updatedComment);
        }
    });
});

//DELETE
comment.delete('/:id', (req, res) => {
    Comments.findByIdAndRemove(req.params.id, (err, deletedComment) => {
        if (err) console.log(err);
		if (deletedComment) {
			console.log(deletedComment);
			res.json(deletedComment);
		}
    });
});


module.exports = comment;