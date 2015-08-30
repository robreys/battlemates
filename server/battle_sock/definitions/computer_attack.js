var utils = require('../utils/module');
var models = require('../../models/module');

module.exports = function(data, socket) {
		//calculate state difference
		//update state
		//pick a random move
		var squad = data.state['squad_' + data.user];
		var mate = squad[data.state['active_mi' + data.user]];
		var moves = mate.moves;
		var m = moves[Math.floor(Math.random()*moves.length)];

		models.Move.findById(m.move, function(err, move) {
			if (err) { console.log(err) }

			//change to next_user
			data.user = 1;
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
	}