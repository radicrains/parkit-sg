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


module.exports = comment;