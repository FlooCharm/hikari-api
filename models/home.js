const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
	isManual: Boolean,
	light: Number,
	temperature: Number,
	lightIntensity: Number,
	lightColor: String,
	isFanOn: Boolean,
	areBlindsOpen: Boolean
})

module.exports = mongoose.model('homes', HomeSchema);