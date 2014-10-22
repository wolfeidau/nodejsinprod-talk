var request = require('request');
var Hoek = require('hoek');
var StatsD = require('node-statsd').StatsD;
var client = new StatsD();
var eventDelay = require('./delay');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function callSecureApi(url, timer) {
	request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	client.timing('node.https.timer.response_time', timer.elapsed());
	    //console.log("Elapsed time for request : " + timer.elapsed() + 'ms');
	  }
	})

}

setInterval(function monitor() {

  	var memory = process.memoryUsage();

  	client.gauge('node.https.gauge.process.rss', memory.rss);
	client.gauge('node.https.gauge.process.heapTotal', memory.heapTotal);
	client.gauge('node.https.gauge.process.heapUsed', memory.heapUsed);

	eventDelay(function delayCallback(err, timetaken){
		client.timing('node.https.timer.event_loop_delay', timetaken);
	});

}, 500);

setInterval(function requestor() {

	var timer = new Hoek.Timer();
	callSecureApi('https://localhost:3443', timer)
	
}, 500);
