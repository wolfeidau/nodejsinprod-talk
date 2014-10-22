var Hoek = require('hoek');

module.exports = function eventDelay(cb) {
    var bench = new Hoek.Bench();
    setImmediate(function () {
    	return cb(null, bench.elapsed());
	});
}	
