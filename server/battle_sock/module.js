var socketio = require('socket.io');
var defs = require('./definitions/module');

module.exports = function(app) {
	var mod = {};

	mod.start = function() {
		//listen for events
		var io = socketio.listen(app.listen(3000));
		//logic
		io.on('connection', function(socket) {
			console.log('a user has connected');
			socket.on('battle-init', function(data) {
				defs.battle_init(data, socket);
			});
			socket.on('user-attack', function(data) {
				defs.user_attack(data, socket);
			});
			socket.on('computer-attack', function(data) {
				defs.computer_attack(data, socket);
			});
		});	
	}

	return mod;
};