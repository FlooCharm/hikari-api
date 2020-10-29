const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const Token = require('../models/token');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Login
router.post('/login', (req, res, next) => {
	const body = req.body;

	if(!body.username || !body.password) return next({
		status: 401,
		message: 'Username or password are missing',
		name: 'Invalid'
	})
	User.findOne({ username: body.username })
		.then(result => {
			if(result){
				result.comparePass(body.password, function(err, isMatch) {
					if(err) throw(err);
					if(isMatch) {
						let access_token = generateAccessToken({ result })
						let refresh_token = jwt.sign({ result }, process.env.REFRESH_TOKEN_SECRET)
						Token.create({
							access_token,
							refresh_token
						}).then((token) => {
							res.status(200).json(token);
						}).catch(next)
					}
					else
						res.status(401).json({
							message: 'Username or password are incorrect',
							name: 'Unauthorized'
						})
				})

			}
			else
				next({
					status: 401,
					message: 'Username or password are incorrect',
					name: 'Unauthorized'
				})
		})
		.catch(next);
})

// POST token
router.post('/token', function(req, res, next) {
	const refresh_token = req.body.token;
	if(!refresh_token) return res.status(401).json({ name: 'Unauthorized', message: 'Invalid token' })
	Token.findOne({
		refresh_token
	}).then((result) => {
		if(!result) return res.status(403).json({ name: 'Forbidden', message: 'Invalid token' })
		
		jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, authData) => {
			if(err) return res.status(401).send({ error: err });
			const access_token = generateAccessToken({ result: authData.result })
			const refresh_token = jwt.sign({ result: authData.result }, process.env.REFRESH_TOKEN_SECRET)
			Token.create({
				access_token,
				refresh_token
			}).then(token => {
				return res.status(200).send(token)
			}).catch(next)
		})
	})

})

function generateAccessToken(user) {
	return jwt.sign(
		user,
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: '2h' },
	)
}

module.exports = router;
