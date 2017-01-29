# Spawn.js
### Management of Application state... 

![Spaun.js](http://2.bp.blogspot.com/_sBl2KZslg98/S_zpYQ4-mFI/AAAAAAAAAD0/5HAjyKHqt7w/s1600/spawn04.jpg)

## About
Spawn is a simple and super small library without dependencies for managment of app state which use modified pub/sub pattern where instead names of events uses zone - paths to data into state object.


## install
With bower:
```
bower install spawn.js --save
```
```html
<script src="bower_components/spawn.js/spawn.min.js"></script>
```
```javascript
var spawn$ = new Spawn();
```
With npm:
```
npm install spawn-x --save
```
```javascript
const Spawn = require('spawn-x');
const spawn$ = new Spawn();
```
## API:
Spawn object after init will be a singletone and he will only have 4 methods:

select() method return selected zone from app state. If zone will be equal '*', this method returns full app state.
```javascript
select(zone: string): any 
```

detect() method makes subscribe for data zone change and apply callback if zone updated. Returns instance object for chaining.

```javascript
detect(zone: string, callback: function): instance
```

update() method for updates zone. Returns instance object for chaining.
```javascript
update(zone: string, data: any): instance 
```

getState() method returns app state similar select('*')
```javascript
getState(): any
```

Note: Spawn in the initialization process might accept simple object as initial app state.

Note: Spawn doesn't apply the callback if current data equal privious data.

Note: You can subscribe on not fully matching zones, and Spawn will apply callbacks correctly. For example: if you subscribe on 'grandpa.parent.child' and will update 'grandpa' or 'grandpa.parent', then 'grandpa.parent.child' will launch own callback if child value changes. If you subscribe on 'grandpa' and will update 'grandpa.parent' or 'grandpa.parent.child', then 'grandpa' will launch own callback without inspection.

Examples:
```javascript
//Example #1
var spawn$ = new Spawn();

function callback() {
    var admins = spawn$.select('users.admins');
    console.log('admin name: ', admins[0].name);
}

//subscribe
spawn$.detect('users.admins', callback);

//update
spawn$.update('users', {
	admins: [
		{ id: 0, name: 'John' },
		{ id: 1, name: 'Alex' }
	]
});
//console output: 'admin name: John'

setTimeout(function() {
	spawn$.update('users', {
		admins: [
			{ id: 0, name: 'Jess' },
			{ id: 1, name: 'Alex' }
		]
	});
}, 2000);

//console output: 'admin name: Jess'
```
```javascript
//Example #2 (Simple app)
function TodoApp() {
	var initialState = {
		todos: []
	},
	spawn$ = new Spawn(initialState);
	
    //subscribe
	spawn$.detect('todos', combineActions);

	function combineActions() {
	    // select
		var todos = spawn$.select('todos');

		if (todos.length > 0) {
			console.log('All todos: ', reportAction(todos));
			console.log('Completed todos:', getCountCompletedAction(todos));
		}
	}

	function reportAction(todos) {
		return todos.length;
	}

	function getCountCompletedAction(todos) {
		return todos.filter(function(todo) {
			return todo.complete === true;
		}).length;
	}

	this.addTask = function (task) {
	    // select
		var todos = spawn$.select('todos');

		todos.push(task);
		
	    //update
		spawn$.update('todos', todos);
	}
}

var app = new TodoApp();

app.addTask({
	action: 'Learn React',
	complete: true
});
app.addTask({
	action: 'Learn Angular 2',
	complete: true
});
app.addTask({
	action: 'Don\'t be the asshole',
	complete: false
});

/*
console output:
All todos:  1
Completed todos: 1
-----
All todos:  2
Completed todos: 2
-----
All todos:  3
Completed todos: 2
-----
*/
```