module.exports = function (move_pct) {
	return Math.random() < (move_pct / 100);
}