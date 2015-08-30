var utils = require('../utils/module');

module.exports = function(config) {
	console.log('battle of type ' + config.type + ' initialized');
	// if (!config.user_id) {
	// 	socket.emit('error', {msg: 'user id not provided.'});
	// }

	models.User
	.findById(config.user_id)
	.populate('mates')
	.exec(function(err, doc) {
		if (err) { console.log(err) };
		//prep move population
		var options = {
			path: 'mates.moves',
			model: 'Move'
		};
		//populate moves
		models.User.populate(doc, options, function(err, user) {
			if (err) { console.log(err) };
			console.log('user', user);
			var mate_state = [];
			for (var i = 0; i < user.mates.length; i++) {
				var mate = user.mates[i];
				console.log('mate', mate);
				var move_state = [];
				//generate move state (REFACTOR HELPER)
				for (var j = 0; j < mate.moves.length; j++) {
					var move = mate.moves[j];
					move_state.push({
						move: move._id,
						base_pp: move.pwr_pts,
						curr_pp: move.pwr_pts
					});
				}
				//generate mate state
				mate_state.push({
					mate: mate._id,
					name: mate.name,
					base_health: mate.health,
					curr_health: mate.health,
					moves: move_state
				});
				//generate battle state
				var battle_state = new models.BattleState({
					squad_1: mate_state,
					squad_2: utils.generate_rock_squad()
				});
				battle_state.save(function(err, bs) {
					if (err) { console.log(err) };
					//finally, generate battle
					var battle = new models.Battle({
						mode: config.mode || 'ai',
						difficulty: config.difficulty || 'noob',
						user_1: user._id,
						user_2: utils.generate_rock_user_id(),
						state: battle_state
					});	
					battle.save(function(err, b) {
						if (err) { console.log(err) };
						//begin battle
						socket.emit('battle-begin', b);
					});	
				});			
			}
		});
	});
}
