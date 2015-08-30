module.exports = function(state, targ_user, damage) {
		var targ_squad = state['squad_' + targ_user];
		var targ_mate = targ_squad[state['active_mi' + targ_user]];
		var health = targ_mate.curr_health - damage;

		targ_mate.curr_health = (health > 0) ? health : 0;
		targ_squad[state['active_mi' + targ_user]] = targ_mate;
		state['squad_' + targ_user] = targ_squad;

		return state;
		//todo: mate dead logic
	}