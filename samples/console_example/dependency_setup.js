DATA = new Dependencies({
	'DOMLoaded': {},
	'pageName': {
		validate: function(data){ return 'string' == typeof data },
		mutator: function(data){ console.log("mutator got:: ", data, typeof data); return data.toUpperCase(); }
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