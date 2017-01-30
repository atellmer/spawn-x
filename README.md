# Spawn.js
### Management of Application state... 

![Spaun.js](http://2.bp.blogspot.com/_sBl2KZslg98/S_zpYQ4-mFI/AAAAAAAAAD0/5HAjyKHqt7w/s1600/spawn04.jpg)

## About
Spawn is a simple and super small library without dependencies for management of app state which use modified pub/sub pattern where instead names of events uses zone - paths to data into state object.


## install
With bower:
```
bower install spawn.js --save
```
```html
<script src="path/to/spawn.js/spawn.min.js"></script>
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
Spawn object after init will be a singleton and he will only have 4 methods:

select() method return selected zone from app state. If zone will be equal '*', this method returns full app state. if zone will be a function, method puts the app state in the function argument and apply it.
```javascript
// Signature:
select(zone: string | function): any 
```
```javascript
// Examples:
spawn$.select('roles.admins');
spawn$.select('*'); // full app state
spawn$.select(function (state) { return state.roles.admins[2] }); // ES5
spawn$.select(state => state.roles.admins[2]); // ES2015
```

detect() method makes subscribe for data zone change and apply callback if zone updated. If zone will be equal '*', this method makes subscribe for all changes. Returns instance object for chaining. 

```javascript
// Signature:
detect(zone: string, callback: function): instance
```
```javascript
// Examples:
spawn$.detect('roles.admins', function() {
  var admins = spawn$.select('roles.admins');
});
spawn$.detect('*', function() {
  console.log('something happened!');
});
```

update() method for updates zone. If zone will be equal '*', this method replaces app state on new state and apply all callbacks without checking. It is may be useful to implementation something like time traveling and others. Returns instance object for chaining.
```javascript
// Signature:
update(zone: string, data: any): instance 
```
```javascript
// Examples:
var admins = [
{ id: 0, name: 'John Doe' },
{ id: 1, name: 'Alex Smith' },
{ id: 2, name: 'Kate Jensen' },
];
spawn$.update('roles.admins', admins);

var oldState = JSON.parse(localStorage.getItem('APP_STATE_1'));
spawn$.update('*', oldState);
```

getState() method returns app state similar select('*')
```javascript
// Signature:
getState(): any
```
```javascript
// Examples:
var appState = spawn$.getState();
```

Note: Spawn in the initialization process might accept plain object as initial app state.

Note: Spawn doesn't apply the callback if current data equal privious data.

Note: You can subscribe on not fully matching zones, and Spawn will apply callbacks correctly. For example: if you subscribe on 'grandpa.parent.child' and will update 'grandpa' or 'grandpa.parent', then 'grandpa.parent.child' will launch own callback if child value changes. If you subscribe on 'grandpa' and will update 'grandpa.parent' or 'grandpa.parent.child', then 'grandpa' will launch own callback without inspection.

Examples:
```javascript
//Example #1
var spawn$ = new Spawn();

function callback() {
    var admin = spawn$.select(function(state) { return state.users.admins[0].name });
    console.log('admin name: ', admin);
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
var initialState = {
  todos: []
},
spawn$ = new Spawn(initialState);

function TodoApp(spawn$) {
  spawn$.detect('todos', combineActions);

  function combineActions() {
    var todos = spawn$.select('todos');

    if (todos.length > 0) {
      console.log('All todos: ', reportAction(todos));
      console.log('Completed todos:', getCountCompletedAction(todos));
      console.log('-----');
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
    spawn$.update('todos', spawn$.select('todos').concat(task));
  }

  this.removeTask = function (id) {
    var filteredTasks = spawn$
      .select('todos')
      .filter(function(task) {
        return task.id !== id;
      });

    spawn$.update('todos', filteredTasks);
  }

  this.completeTask = function (id, complete) {
    var updatedTasks = spawn$
      .select('todos')
      .map(function(task) {
        if (task.id === id) {
          task.complete = complete;
        }

        return task;
      });

    spawn$.update('todos', updatedTasks);
  }
}


TodoApp.logger = function(spawn$) {
  spawn$.detect('*', function() {
    console.log('logger: ', spawn$.select('*'));
  });
}


///////////////////////////
var app = new TodoApp(spawn$);
TodoApp.logger(spawn$);

app.addTask({
  id: 0,
  action: 'Learn React',
  complete: true
});

app.addTask({
  id: 1,
  action: 'Learn Angular',
  complete: true
});

app.addTask({
  id: 2,
  action: 'Don\'t be the asshole',
  complete: false
});

app.completeTask(2, true);

/*
console output:

All todos:  1
Completed todos: 1
-----
logger: ...
All todos:  2
Completed todos: 2
-----
logger: ...
All todos:  3
Completed todos: 2
-----
All todos:  3
Completed todos: 3
-----
logger: ...
*/
```