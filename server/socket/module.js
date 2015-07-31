var socketio = require('socket.io');
var models = require('../models/module');

module.exports = function(app, db) {
	var module = {};

	module.begin = function() {
		//listen for events
		var io = socketio.listen(app.listen(3000));
		//logic
		io.on('connection', function(socket) {
			console.log('a user has connected');
			// socket.on('battle-init', battle_init);
			socket.on('user-attack', function(data) {
				user_attack(data, socket);
			});
			socket.on('computer-attack', function(data) {
				computer_attack(data, socket);
			});
			// socket.on('user-swap', user_swap);
		});	
	}

	return module;

	//primary function definitions
	function battle_init(config) {
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
						squad_2: generate_rock_squad()
					});
					battle_state.save(function(err, bs) {
						if (err) { console.log(err) };
						//finally, generate battle
						var battle = new models.Battle({
							mode: config.mode || 'ai',
							difficulty: config.difficulty || 'noob',
							user_1: user._id,
							user_2: generate_rock_user_id(),
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

	// function battle_join(data) {

	// }

	function user_attack(data, socket) {
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
				if (!hit_success(move.hit_pct)) {
					socket.emit('attack-miss', data);
				}
				else {
					//calculate state difference
					//update state
					data.state = apply_damage(data.state, data.user, move.damage);
					data.animation_url = move.animation;
					data.message = mate.name + ' used ' + move.name + '!';
					socket.emit('trigger-animation', data);
				}
			});
		// }
	}

	function computer_attack(data, socket) {
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
			if (!hit_success(move.hit_pct)) {
				socket.emit('attack-miss', data);
			}
			else {
				//calculate state difference
				//update state
				data.state = apply_damage(data.state, data.user, move.damage);
				data.animation_url = move.animation;
				data.message = mate.name + ' used ' + move.name + '!';
				socket.emit('trigger-animation', data);
			}
		});
	}

	// function user_swap(data) {

	// }

	//helper functions
	function generate_rock_squad() {
		//hardcoded move "one inch punch"
		var move_state = [{
			move: "55b56793ba82ad9d52fb5629",
			base_pp: 100,
			curr_pp: 100,
		}];
		//hardcoded mate "rock"
		var mate = {
			mate: "55b56794ba82ad9d52fb562a",
			health: 9001,
			moves: move_state
		};
		return [mate];
	}

	function generate_rock_user_id() {
		//hardcoded rock user id "rocky"
		return "55b56794ba82ad9d52fb562b";
	}

	function hit_success(move_pct) {
		return Math.random() < (move_pct / 100);
	}

	function apply_damage(state, targ_user, damage) {
		var targ_squad = state['squad_' + targ_user];
		var targ_mate = targ_squad[state['active_mi' + targ_user]];
		var health = targ_mate.curr_health - damage;

		targ_mate.curr_health = (health > 0) ? health : 0;
		targ_squad[state['active_mi' + targ_user]] = targ_mate;
		state['squad_' + targ_user] = targ_squad;

		return state;
		//todo: mate dead logic
	}

};