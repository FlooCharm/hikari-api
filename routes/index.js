const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const moment = require('moment');

const User = require('../models/user');
const Home = require('../models/home');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hikari' });
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
						jwt.sign(
							{ result },
							'secretKey',
							{ expiresIn: '9999 years' },
							(err, accessToken) => {
								if(err) next({
									message: "Invalid operation",
									name: 'Forbidden'
								});
								res.status(200).json({ accessToken });
							}
						)
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

// GET home data
router.get('/data', verifyToken, function(req, res, next) {
	const id = process.env.HOME_ID;

	const hour = moment().hour();

	Home.findById(id)
		.then(result => {
			if(result){
				let newResult = Object.assign(result, { 
					isEarly: hour < 18 && hour > 8
				});
				res.status(200).json(newResult);
			}
			else
				res.status(404).send('Data not found');
		})
		.catch(next)
})

// POST home data
router.post('/home', verifyToken, function(req, res, next) {
	const body = req.body;

	Home.create(body)
		.then(result => {
			if(result)
				res.status(200).json({
					data: result
				})
			else
				next({
					message: "Can't register data",
					name: 'Invalid'
				})
		})
		.catch(next);
})

// UPDATE home data
router.put('/update-data', verifyToken, function(req, res, next) {
	const body = req.body;
	const id = process.env.HOME_ID;

	Home.findByIdAndUpdate(id, body, { new: true })
		.then(result => {
			if(result)
				res.status(201).json({
					data: result
				})
			else
				next({
					message: "Can't update data",
					name: 'Invalid'
				})
		})
		.catch(next);
})

// Authorization
function verifyToken(req, res, next) {
	const bearerHeader = req.headers['authorization']
	if (!bearerHeader) return next({ status: 401, message: 'No token provided', name: 'Unauthorized'})
	let token = bearerHeader.split(' ');

	if(token && token[1]) {
		req.token = token[1];
		next();
	} else {
		next({
			status: 401,
			message: 'Invalid token',
			name: 'Forbidden'
		})
	}
}

module.exports = router;
