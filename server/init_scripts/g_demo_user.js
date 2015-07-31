var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/battlemates');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	var models = require('../models/module');
	var move = new models.Move({
		name: "roundhouse kick",
	  type: "red",
	  damage: 20,
	  hit_pct: 100,
	  pwr_pts: 100,
	  animation: "http://38.media.tumblr.com/tumblr_lmpnuebZFK1qijfqzo1_400.gif"
	});
	move.save(function(err, m) {
		if (err) { console.log(err) }

		var friend = new models.Mate({
			name: "friend",
			type: "red",
			health: 100,
			moves: [m._id]
		});
		friend.save(function(err, f) {
			if (err) { console.log(err) };

			var demo_user = new models.User({
				username: "demo user",
				mates: [f._id]
			});
			demo_user.save(function(err, du) {
				if (err) { console.log(err) }
				//successfully create rock user
				console.log("created demo user");
				console.log(du);
				db.close();
			});
		});
	})
});