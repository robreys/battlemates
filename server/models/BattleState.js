var mongoose = require("mongoose");

var MoveStateSchema = mongoose.Schema({
	move: {type: mongoose.Schema.Types.ObjectId, ref: 'Move', required: true},
	name: {type: String, required: true},
	base_pp: {type: Number, required: true},
	curr_pp: {type: Number, required: true}
}, { _id: false });

var MateStateSchema = mongoose.Schema({
	mate: {type: mongoose.Schema.Types.ObjectId, ref: 'Mate', required: true},
	name: {type: String, required: true},
	base_health: {type: Number, required: true},
	curr_health: {type: Number, required: true},
	moves: [MoveStateSchema]
}, { _id: false });

var BattleStateSchema = mongoose.Schema({
	squad_1: {type: [MateStateSchema], required: true},
	active_mi1: {type: Number, default: 0},
	squad_2: {type: [MateStateSchema], required: true},
	active_mi2: {type: Number, default: 0}
});

// schema.path('team_1').validate(function (v) {
//   return v && validateTeam(v);
// }, 'my error type'); 

// schema.path('team_2').validate(function (v) {
//   return v && validateTeam(v);
// }, 'my error type'); 

module.exports = mongoose.model('BattleState', BattleStateSchema); 

// function validateTeam(v) {
// 	//bad team size
// 	if (v.length <= 0 || v.length > 6) {
// 		return false;
// 	}
// 	//determine if MateState initialized
// 	for (var i = 0; i < v.length; i++) {
// 		var ms = v[i];
// 		if ( !(ms.mate_id && ms.health && ms.moves)) {
// 			return false;
// 		}
// 		//determine if MoveState initialized
// 		if (ms.moves.length != 4) {
// 			return false
// 		}
// 		for (var j = 0; j < ms.moves.length; j++) {
// 			if (!(move_id && base_pp && curr_pp)) {
// 				return false
// 			}
// 		}
// 	}
// 	//validation successful
// 	return true;
// }