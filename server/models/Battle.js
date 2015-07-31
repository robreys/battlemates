var mongoose = require("mongoose");

var BattleSchema = mongoose.Schema({
	mode: {type: String, required: true},
	difficulty: {type: String},
	user_1: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	user_2: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	state: {type: mongoose.Schema.Types.ObjectId, ref: 'BattleState', required: true},
	access_ts: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Battle', BattleSchema); 