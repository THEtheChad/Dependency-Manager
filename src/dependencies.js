function Dependencies(deps){
	this._data = {};
	this._depList = deps;
	this._queue = [];
	this._resolved = 0;
	this._depCount = 0;
	this._subDeps = [];

	for(var k in deps) this._depCount++;
}
Dependencies.prototype = {
	resolved: function(deps, fn){
		if(!fn){
			fn = deps;
			(this._resolved == this._depCount) ? fn(this._data) : this._queue.push(fn);
			return this;
		}

		var deps = new Dependencies(deps);
		deps.resolved(fn);

		var data = this._data;
		for(var name in data){
			deps.resolve(name, data[name]);
		}

		this._subDeps.push(deps);

		return deps;
	},

	immediate: function(fn){
		if(this._resolved != this._depCount){
			throw new Error('depenencies were not ready at the time this action was run. Check your code for race conditions.');
		}

		fn(this._data);
	},

	resolve: function(name, data){
		if(!this._depList.hasOwnProperty(name)) return;
		if(this._data.hasOwnProperty(name)) return console.error('Dependency already met: ' + name);

		if(!this._valid(name, data)) return false;

		this._data[name] = data;
		var subDeps = this._subDeps, i = subDeps.length;
		while(i--){
			subDeps[i].resolve(name, data);
		}

		if(++this._resolved == this._depCount){
			var q = this._queue, data = this._data;
			for(var i = 0, len = q.length; i < len; i++){
				q[i](data);
			}
		}

		return true;
	},

	_valid: function(name, data){
		var validate = this._depList[name];
		var result = (typeof validate == 'function') ? validate(data) : true;

		if(!result){
			console.error('Invalid data passed to ' + name + '.', data);
		}

		return result;
	}
};

DATA = new Dependencies({
	'pageName': function(data){ return (typeof data == 'string') },
	'pageNumber': function(data){ return (typeof data == 'number') },
	'productId': function(data){ return (typeof data == 'number') },
	'DOMReady': true
});

// These are the functions we wish to fired when dependencies are met
DATA.resolved(function(data){ console.log(data) });

DATA.resolved({
	'pageName': 1,
	'pageNumber': 1,
	'DOMReady': 1
}, function transmit(data){
	console.log('transmit', data);
});

DATA.resolved({
	'pageNumber': 1,
	'productId': 1
}, function trackProduct(data){
  console.log('track', data);
});

// Here is where we resolve the dependencies and attach the data
DATA.resolve('pageName', 'Home Page');
DATA.resolve('pageNumber', 2);
DATA.resolve('productId', 123456789);

window.onload = function(){
	DATA.resolve('DOMReady');
};