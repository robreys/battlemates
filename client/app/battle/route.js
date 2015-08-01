import Ember from 'ember';

export default Ember.Route.extend({
	battle_svc: Ember.inject.service('battle-svc'),

	beforeModel: function() {
		// this.get('battle_svc').battle_init();
		
	}
});
