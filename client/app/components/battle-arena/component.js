import Ember from 'ember';

export default Ember.Component.extend({
	battle_state: null,

	active_m1: function() {
		var bs = this.get('battle_state');
		return bs.squad_1[bs.active_mi1];
	}.property('battle_state.active_mi1'),
	active_m2: function() {
		var bs = this.get('battle_state');
		return bs.squad_2[bs.active_mi2];
	}.property('battle_state.active_mi2'),

	health_pct2_style: function() {
		var am2 = this.get('active_m2');
		var pct = (am2.curr_health/am2.base_health) * 100 + '%';
		return "width:"+ pct;
	}.property('battle_state.active_m2'),
	health_pct1_style: function() {
		var am1 = this.get('active_m1');
		var pct = (am1.curr_health/am1.base_health) * 100 + '%';
		return "width:"+ pct;
	}.property('battle_state.active_m1'),

});
