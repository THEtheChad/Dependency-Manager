DATA.resolved([
	'DOMLoaded',
	'pageName'
], function logPageView(data){
	console.log("logPageView# Send analytics data#", data.pageName[0]);
	// analytics.send( data.pageName[0] );
});

DATA.resolved({
	'userName': {
		mutator: function(data){
			var tokens = data.split(' ');

			return {
				first: tokens[0],
				last : tokens[1]
			};
		}
	}
}, function dbInsertNames(data){
	console.log("dbInsertNames#Inserting firstName#", data.userName[0].first);
	console.log("dbInsertNames#Inserting lastName#", data.userName[0].last);
	// database.insert( 'firstName', data.userName[0].first )
	// database.insert( 'lastName' , data.userName[0].last  )
});

DATA.resolved([
	'DOMLoaded'
], [
	function docReady(){ console.log("Calling docReady");},
	function initialize(){ console.log("Calling initialize");},
	function fireZMissiles(){ console.log("Calling fireZMissiles");}
]);