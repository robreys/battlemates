var mongoose = require("mongoose");

var MoveSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: String, required: true},
  damage: {type: Number, required: true},
  hit_pct: {type: Number, required: true},
  pwr_pts: {type: Number, required: true},
  animation: {type: String, required: true}
});

module.exports = mongoose.model('Move', MoveSchema); 