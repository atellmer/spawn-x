# Spawn.js
#### Management of Application state... 
(subscription on the data bit)

![Spaun.js](http://2.bp.blogspot.com/_sBl2KZslg98/S_zpYQ4-mFI/AAAAAAAAAD0/5HAjyKHqt7w/s1600/spawn04.jpg)

With bower:
```
bower install spawn.js --save
```
```html
<script src="bower_components/spawn.js/spawn.min.js"></script>
```
With npm:
```
npm install spawn-x --save
```
```javascript
var Spawn = require('spawn-x');
```

Examples:
```javascript
//Example #1
var spawn$ = new Spawn();

function callback() {
    var admins = spawn$.getState().users.admins;
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
		var todos = spawn$.getState().todos;

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
	    //update
		var todos = spawn$.getState().todos;

		todos.push(task);
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
	action: 'Learn Meteor',
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