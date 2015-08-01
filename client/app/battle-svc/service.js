import Ember from 'ember';

export default Ember.Service.extend({
  socket: {},
  battle_state: null,

  setup: function () {
    this.set('socket', io.connect('http://localhost:3000', {reconnect: true}));
  }.on('init'),

  battle_init: function() {
  	console.log('init battle');
  	this.get('socket').emit('battle-init', {
  		mode: "ai",
      user_id: '55b56a71d0f0bede53fa1a51'
  	});
  },

  attack: function(move_id, move_index) {
    this.get('socket').emit('user-attack', {
      state: this.battle_state,
      user: 1,
      move_id: move_id,
      move_index: move_index
    });
  }
});
