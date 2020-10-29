const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Creates model for Route
const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		lowercase: true,
		required: [true, 'is required'],
		index: { unique: true }
	},
	password: {
		type: String,
		required: [true, 'is required']
	},
})

UserSchema.methods.comparePass = function (testPass, callback) {
	let user = this;

	bcrypt.compare(testPass, user.password, function(err, isMatch) {
		if(err) return callback(err);

		callback(null, isMatch);
	})
}

module.exports = mongoose.model('users', UserSchema);