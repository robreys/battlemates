var mongoose = require("mongoose");

var MateSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  health: {type: Number, required: true},
  moves: [{type: mongoose.Schema.Types.ObjectId, ref: 'Move', required: true}],
  img: {type: String}
});

module.exports = mongoose.model('Mate', MateSchema); 