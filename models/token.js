const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
	access_token: {
		type: String
	},
	refresh_token: {
		type: String
	},
	created_at: {
		type: Date,
		default: Date.now,
		index: {
			expires: '12h'
		}
	}
})

module.exports = mongoose.model('tokens', TokenSchema);