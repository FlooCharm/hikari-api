const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose');

require('dotenv').config({ path: '.env' });

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

mongoose.connect(process.env.DB_URL, { 
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use((error, req, res, next) => {
	if(error) {
		res.status(error.status || 500).json({
			message: error.message,
			type: error.name
		})
	}
	else {
		res.send(500)
	}
})

module.exports = app;
