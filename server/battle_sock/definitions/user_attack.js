var utils = require('../utils/module');
var models = require('../../models/module');

module.exports = function(data, socket) {
		// if (!data.move_id) {
		// 	socket.emit('error', {msg: ''});
		// }
		// else {
			var squad = data.state['squad_' + data.user];
			var mate = squad[data.state['active_mi' + data.user]];

			models.Move.findById(data.move_id, function(err, move) {
				if (err) { console.log(err); }	
				//change to next_user
				data.user = 2;
				data.animation_url = move.animation;
				if (!utils.hit_success(move.hit_pct)) {
					socket.emit('attack-miss', data);
				}
				else {
					//calculate state difference
					//update state
					data.state = utils.apply_damage(data.state, data.user, move.damage);
					data.animation_url = move.animation;
					data.message = mate.name + ' used ' + move.name + '!';
					socket.emit('trigger-animation', data);
				}
			});
		// }
	}