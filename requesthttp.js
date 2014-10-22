var request = require('request');
var Hoek = require('hoek');
var StatsD = require('node-statsd').StatsD;
var client = new StatsD();
var eventDelay = require('./delay');


function callSecureApi(url, timer) {
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	client.timing('node.http.timer.response_time', timer.elapsed());
	    //console.log("Elapsed time for request : " + timer.elapsed() + 'ms');
	  }
	})

}

setInterval(function monitor() {

  	var memory = process.memoryUsage();

  	client.gauge('node.http.gauge.process.rss', memory.rss);
	client.gauge('node.http.gauge.process.heapTotal', memory.heapTotal);
	client.gauge('node.http.gauge.process.heapUsed', memory.heapUsed);

	eventDelay(function(err, timetaken){
		client.timing('node.http.timer.event_loop_delay', timetaken);
	});

}, 500);

setInterval(function requestor() {

	var timer = new Hoek.Timer();
	callSecureApi('http://localhost:3080', timer)

}, 500);
