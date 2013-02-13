addEventListener('app-ready', function(e){
	
	console.log('app-ready');

	// import the module
	// already done in app.js
	// var mdns = require('mdns');

	// watch all http servers
	var browser = mdns.createBrowser(mdns.tcp('http'));
	console.log( 'mdns', mdns );
	console.log( 'browser', browser );

	browser.on('serviceUp', function(service) {
	  console.log("service up: ", service.name );
	});

	browser.on('serviceDown', function(service) {
	  console.log("service down: ", service);
	});
	
	browser.start();
});
