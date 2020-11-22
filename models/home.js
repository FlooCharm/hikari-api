const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
	isManual: Boolean,
	light: Number,
	temperature: Number,
	lightIntensity: Number,
	rColor: Number,
	gColor: Number,
	bColor: Number,
	isEarly: Boolean,
	isFanOn: Boolean,
	areBlindsOpen: Boolean
})

module.exports = mongoose.model('homes', HomeSchema);