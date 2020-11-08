const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
	isManual: Boolean,
	light: Number,
	temperature: Number,
	schedule: {
		monday: {
			lightFrom: String,
			lightTo: String,
			blindsFrom: String,
			blindsTo: String,
		},
		tuesday: {
			lightFrom: String,
			lightTo: String,
			blindsFrom: String,
			blindsTo: String,
		},
		wednesday: {
			lightFrom: String,
			lightTo: String,
			blindsFrom: String,
			blindsTo: String,
		},
		thursday: {
			lightFrom: String,
			lightTo: String,
			blindsFrom: String,
			blindsTo: String,
		},
		friday: {
			lightFrom: String,
			lightTo: String,
			blindsFrom: String,
			blindsTo: String,
		},
		saturday: {
			lightFrom: String,
			lightTo: String,
			blindsFrom: String,
			blindsTo: String,
		},
		sunday: {
			lightFrom: String,
			lightTo: String,
			blindsFrom: String,
			blindsTo: String,
		}
	},
	lightIntensity: Number,
	lightColor: String,
	isFanOn: Boolean,
	areBlindsOpen: Boolean
})

module.exports = mongoose.model('homes', HomeSchema);