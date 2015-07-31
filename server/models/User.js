var mongoose = require("mongoose");

var UserSchema = mongoose.Schema({
	username: {type: String, required: true},
	//must have at least one mate
	mates: [{type: mongoose.Schema.Types.ObjectId, ref: 'Mate'}]
});

module.exports = mongoose.model('User', UserSchema); 