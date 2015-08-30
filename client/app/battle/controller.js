import Ember from 'ember';

export default Ember.Controller.extend({
	battle_svc: Ember.inject.service(),
	battle_state: null,

	notification: null,

	overlay_enabled: false,
	overlay_visibility: function() {
		return (this.overlay_enabled) ? '' : 'hidden';
	}.property('overlay_enabled'),

	animation_url: null,
	animation_loaded: false,
	animation_visibility: function() {
		return (this.animation_loaded) ? '' : 'hidden';
	}.property('animation_loaded'),

	setup: function() {
		var self = this;
		var socket = this.get('battle_svc').socket;
		socket.on('battle-begin', function(state) {
			console.log('commencing battle of difficulty ' + state.difficulty);
			self.set('battle_state', state);
			self.get('battle_svc').set('battle_state', state);
		});
		// socket.on('attack-miss', function(data){
		// 	if (data.user === 2) {
		// 		socket.emit('computer-attack', data);
		// 	}
		// 	else {
		// 		return;
		// 	}
		// });
		socket.on('trigger-animation', function(data) {
			self.set('overlay_enabled', true);
			self.notify_move(data.message).then(function() {
				self.set('animation_url', data.animation_url);
				//reveal animation once gif has loaded
				Ember.$('div.animation img').one('load', function() {
					self.set('animation_loaded', true);
					Ember.run.later(function() {
						self.set('animation_loaded', false);
						self.set('animation_url', null);
						console.log('user', data.user);
						self.set('battle_state', data.state);
						self.set('overlay_enabled', false);
						if (data.user === 2) {
							socket.emit('computer-attack', data);
						}
						else  {
							return;
						}
					}, 2000);			
				});
			});
		});

		var battle_state =
		{
		  "_id": "55b5b10b56d510b9639d27b8",
		  "squad_2":[
		    {
		      "mate":"55b56794ba82ad9d52fb562a",
		      "name": "rock",
		      "base_health":100,
		      "curr_health":50,
		      "moves":[
		        {
		          "move": "55b56793ba82ad9d52fb5629",
		          "name": "one inch punch",
		          "base_pp":100,
		          "curr_pp":100
		        }
		      ]
		    }
		  ],
		  "active_mi2": 0,
		  "squad_1":[
		    {
		      "mate": "55b56a71d0f0bede53fa1a50",
		      "name": "friend",
		      "base_health":100,
		      "curr_health": 50,
		      "moves":[
		        {
		          "move": "55b56a71d0f0bede53fa1a4f",
		          "name": "roundhouse kick",
		          "base_pp":100,
		          "curr_pp":100
		        }
		      ]
		    }
		  ],
		  "active_mi1": 0,
		  "__v":0
		};
		self.set('battle_state', battle_state);
		self.get('battle_svc').set('battle_state', battle_state);
	}.on('init'),

	notify_move: function(message) {
		var self = this;
		return new Promise(function(resolve, reject) {
			self.set('notification', message);
			Ember.run.later(function() {
				self.set('notification', null);
				resolve();
			}, 2500);
		});
	}
});
