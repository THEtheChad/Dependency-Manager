function isArray(obj) { return (obj instanceof Array)   }
function isObject(obj){ return (typeof obj == 'object') }
function isString(obj){ return (typeof obj == 'string') }

function toArray(obj){
	if(obj == null) return [];
	if(isArray(obj)) return obj;
	return [obj];
}

function Dependencies(dependencies, actions){
	var data = {};
	var count = 0;

	// convert ('dep1', 'dep2', 'dep3') to ['dep1', 'dep2', 'dep3']
	if(isString(dependencies)){
		dependencies = Array.prototype.slice.call(arguments);
		actions = [];
	}

	actions = toArray(actions);

	// convert ['dep1', 'dep2'] to standard dependency definiton
	if(isArray(dependencies)){
		var obj = {};

		for(var i = 0, ilen = dependencies.length; i < ilen; i++){
			var name = dependencies[i];
			obj[name] = {count: 1};
		}

		dependencies = obj;
	}

	for(var name in dependencies){
		var val = dependencies[name];

		// convert {'dep1': 1, 'dep2': 2} to standard dependency definiton
		if('number' == typeof val){
			dependencies[name] = {count: val};
		}

		count += dependencies[name].count || (dependencies[name].count = 1);
		data[name] = [];
	}

	this._data = data;
	this._resolved = 0;
	this._depCount = count;
	this._actions = actions || [];
	this._dependencies = dependencies;

	this._subDeps = [];
}

Dependencies.prototype = {
	resolve: function(name, data){
		var definition = this._dependencies[name];

		// does this dependency exist
		if(!definition){
			return false;
		}

		// verify dependency count
		if(!definition.count){
			this.error('Dependency has already been met: ' + name + '.  ', data);
			return false;
		}

		// validate data
		if(definition.validate){
			if(!definition.validate(data)){
				this.error('Dependency failed validation: ' + name + '.  ', data);
				return false;
			}
		}

		// mutate data
		if(definition.mutator){
			data = definition.mutator(data);
		}
		this._data[name].push(data);

		// this dependency has been resolved
		this._resolved++;
		definition.count--;

		// do these same steps for all subdependencies
		var subDeps = this._subDeps;
		var i = subDeps.length;
		while(i--) subDeps[i].resolve(name, data);

		// have all dependencies been resolved?
		if(this._resolved == this._depCount){
			var actions = this._actions;
			var i = actions.length;
			var data = this._data;

			while(i--) actions[i](data);
		}

		return true;
	},

	resolved: function(dependencies, actions){
		if(isObject(dependencies)){
			var sub = new Dependencies(dependencies, actions);

			// add existing data to new dependency
			var data = this._data;
			for(var name in data){
				var list = data[name];
				var i = list.length;

				while(i--) sub.resolve(name, list[i]);
			}

			// add it to the list of sub dependencies
			this._subDeps.push(sub);

			return sub;
		}

		// add new actions to our list
		actions = toArray(dependencies);
		this._actions = this._actions.concat(actions);

		// if dependencies are resolved,
		// fire actions immediately
		if(this._resolved == this._depCount){
			var i = actions.length;
			var data = this._data;

			while(i--) actions[i](data);
		}

		return this;
	},

	error: function(message, data){
		console.error(message, data);
	}
};