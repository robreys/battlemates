module.exports = function() {
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