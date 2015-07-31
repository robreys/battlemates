var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/battlemates');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	var models = require('../models/module');
	var move = new models.Move({
		name: "one inch punch",
	  type: "red",
	  damage: 10,
	  hit_pct: 100,
	  pwr_pts: 100,
	  animation: "http://i2.wp.com/cosmicbuddha.com/wp-content/uploads/one-inch_punch.gif"
	});
	move.save(function(err, m) {
		if (err) { console.log(err) }

		var rock = new models.Mate({
			name: "rock",
			type: "green",
			health: 100,
			moves: [m._id]
		});
		rock.save(function(err, r) {
			if (err) { console.log(err) };

			var rock_user = new models.User({
				username: "rocky",
				mates: [r._id]
			});
			rock_user.save(function(err, ru) {
				if (err) { console.log(err) }
				//successfully create rock user
				console.log("created rock user");
				console.log(ru);
				db.close();
			});
		});
	})
});