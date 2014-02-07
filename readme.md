# Dependency Manager

- **Author:** Chad Elliott
- **Version:** 0.1.0

The dependency manager gives you an explicit api for ensuring that all synchrounous and asynchronous dependencies are met before an action/actions are taken.

## Defining a Dependency
---
Dependencies can only be defined in the constructor. This is intentional and ensures that all dependencies are resolved before firing any actions.

### Simple Definition (single fire)

Allows for named dependencies that fire once.

```
new Dependencies([
	'dep1',
	'dep2',
	'dep3'
]);

new Dependencies(
	'dep1',
	'dep2',
	'dep3'
);
```

### Simple Definition (multi fire)

```
new Dependencies({
	'dep1': 1,
	'dep2': 2,
	'dep3': 3
});
```

### Simple Definition (single fire w/ validation)

```
new Dependencies({
	'dep1': function validate1(data){ return truthy//falsy },
	'dep2': function validate2(data){ return falsy//truthy }
});
```

### Complex Definition

All parameters are optional in the complex definition. An undefined count is assumed to be 1.

```
new Dependencies({
	'dep1': {
		count: 2,
		validate: function(data){
			return truthy/falsy
		},
		mutator: function(data){
			return data;
		}
	},
	'dep2': {
		// count assumed to be 1
		validate: function(data){
			return truthy/falsy
		},
		mutator: function(data){
			return data;
		}
	}
});
```

## Resolving a Dependency
---
Dependencies are resolved by name. A dependency can be passed data that will be forwarded to each action registered with the dependency object.

```
deps.resolve('dep1', '1');
// true
```

A dependency will not be resolved if the data it recieves does not pass the validator. The `resolve` method will also return __false__ to indicate that invalid data was passed.

```
deps.resolve('dep2', '2');
// false
```

## Defining Actions
---
Actions are the things we want to do once all the dependencies are resolved. These are functions that are registered with the dependency object through the `resolved` method.

```
var action = function(results){ console.log('high five') };
deps.resolved(action);
```

It's important to note that the data being passed to the resolution function is in the form of an object, with each dependency's response stored as a value using the name of the dependency as a key.

Example:

```
deps.resolve('dep2', {});
deps.resolve('dep3');
```

All of the dependencies on this object have been met, therefore, the resolution actions are called. In this case `action` was the only function registered to execute. `action` is passed an object that looks like the following:

```
{
  dep1: '1',
  dep2: {},
  dep3: undefined
}
```
It's also important to note that a dependency can only be resolved once and will simply ignore any additional calls. This may change in the future.

## Things to Note
---
Even though dependencies can only be declared once, actions can be added at any time. If all the dependencies are met, actions will be fired immediately, and be sent the results object from the earlier dependencies.

# Deprecated

## Immediate Method
---
The `immediate` method attempts to fire an action immediately. If the dependencies aren't met at the time the action is called, an error is thrown. This method is included to help with debugging race conditions.


## Global Dependencies
---

### Defining

```
Dependencies.global({
  global1: function(){ return true },
  global2: function(){ return true }
});
```

### Resolving
```
Dependencies.resolve('global1', 'someData');
```

### Inheriting

```
var deps = new Dependencies({
  global1: 'global',
  global2: 'global'
});
```