const bcrypt = require('bcrypt');
const express = require('express');
const sessions = express.Router();
const User = require('../models/users');

// sessions.get('/', (req, res) => {
// 	res.render('sessions/new.ejs', { currentUser: req.session.currentUser });
// });

sessions.post('/', (req, res) => {
	User.findOne({ username: req.body.username }, (err, foundUser) => {
		console.log(req.body);
		if (!foundUser) {
			console.log('cannot find user', req.body.username);
			// res.redirect('/sessions');
		} else {
			if (bcrypt.compareSync(req.body.password, foundUser.password)) {
				req.session.currentUser = foundUser._id;
				console.log(req.session)
				console.log('successful login');
                res.json(foundUser);
			} else console.log('unsuccessful login')
		}
	});
});

sessions.delete('/', (req, res) => {
	req.session.destroy((err) => {
        if(err) console.log(err);
		console.log('successful logout');
		res.json('Destroyed session');
	});
});

module.exports = sessions;
