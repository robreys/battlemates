import Ember from 'ember';

export default Ember.Component.extend({
	battle_svc: Ember.inject.service(),
	battle_state: null,

	primary_menu: true,
	menu_selection: null,
	menu_items: function() {
		if (this.primary_menu)
			return ['attack'];
		else {
			if (this.menu_selection === 'attack') {
				var bs = this.get('battle_state');
				return bs.squad_1[bs.active_mi1].moves;
			}
		}
	}.property('primary_menu'),

	actions: {
		menu_select: function(selection) {
			this.set('primary_menu', false);
			this.set('menu_selection', selection);
		},
		attack: function(move_id, move_index) {
			this.get('battle_svc').attack(move_id, move_index);
			this.set('primary_menu', true);
		}
	}
});
