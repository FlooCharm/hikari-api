const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
	temperature: {
		type: Number
	},
	light: {
		type: Number
	},
	isLightOn: {
		type: Boolean
	}
})

module.exports = mongoose.model('homes', HomeSchema);