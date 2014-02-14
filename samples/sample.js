DATA = new Dependencies({
	'DOMLoaded': {},
	'pageName': {
		validate: function(data){ return 'string' == typeof data },
		mutator: function(data){ return data.toUppercase() }
	},
	'productId': {
		validate: function(data){ return 'number' == typeof data }
	},
	'orderId': {
		validate: function(data){ return 'number' == typeof data }
	},
	'userName': {
		validate: function(data){ return 'string' == typeof data }
	}
});


DATA.resolved([
	'DOMLoaded',
	'pageName'
], function logPageView(data){
	analytics.send( data.pageName[0] );
});

DATA.resolved({
	'userName': {
		mutator: function(data){
			var tokens = data.splite(' ');

			return {
				first: tokens[0],
				last : tokens[1]
			};
		}
	}
}, function dbInsertNames(data){
	database.insert( 'firstName', data.userName[0].first )
	database.insert( 'lastName' , data.userName[0].last  )
});

DATA.resolved([
	'DOMLoaded'
], [
	function docReady(){},
	function initialize(){},
	function fireZMissiles(){}
]);