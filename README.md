# Spawn
### App state management 

![Spawn](http://2.bp.blogspot.com/_sBl2KZslg98/S_zpYQ4-mFI/AAAAAAAAAD0/5HAjyKHqt7w/s1600/spawn04.jpg)

## About
Spawn is a simple and super small library without dependencies for management of app state which use modified pub/sub pattern where instead names of events uses zone - paths to data into state object.


## install
With bower:
```
bower install spawn.js --save
```
```html
<script src="path/to/spawn.js/lib/spawn.umd.min.js"></script>
```
```javascript
var store = Spawn.createStore();
```
With npm:
```
npm install spawn-x --save
```
```javascript
import { createStore } from 'spawn-x';

const store = createStore();
```
## API:
Spawn object (store) after init will only have 4 methods:

select() method return selected zone from app state. If zone will be equal '*', this method returns full app state. If zone will be equal '->', this method returns lastest updated zone name. if zone will be a function, method puts the app state in the function argument and apply it.
```javascript
// Signature:
select(zone: string | function): any 
```
```javascript
// Examples:
store.select('roles.admins');
store.select('*'); // full app state
store.select('->'); // latest updated zone name, for example 'roles.admins'
store.select(function (state) { return state.roles.admins[2] }); // ES5
store.select(state => state.roles.admins[2]); // ES2015
```

detect() method makes subscribe for data zone change and apply callback if zone updated. If zone will be equal '*', this method makes subscribe for all changes. Returns instance object for chaining. 

```javascript
// Signature:
detect(zone: string, callback: function): instance
```
```javascript
// Examples:
store.detect('roles.admins', function() {
  var admins = store.select('roles.admins');
});
store.detect('*', function() {
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
store.update('roles.admins', admins);

var oldState = JSON.parse(localStorage.getItem('APP_STATE_1'));
store.update('*', oldState);
```

getState() method returns app state similar select('*')
```javascript
// Signature:
getState(): any
```
```javascript
// Examples:
var appState = store.getState();
```

Note: Spawn in the initialization process might accept plain object as initial app state.

Note: Spawn doesn't apply the callback if current data equal privious data.

Note: You can subscribe on not fully matching zones, and Spawn will apply callbacks correctly. For example: if you subscribe on 'grandpa.parent.child' and will update 'grandpa' or 'grandpa.parent', then 'grandpa.parent.child' will launch own callback if child value changes. If you subscribe on 'grandpa' and will update 'grandpa.parent' or 'grandpa.parent.child', then 'grandpa' will launch own callback without inspection.

Examples:
```javascript
//Example #1
const store = Spawn.createStore();

function callback() {
    const admin = store.select(state => state.users.admins[0].name);
    console.log('admin name: ', admin);
}

//subscribe
store.detect('users.admins', callback);

//update
store.update('users', {
  admins: [
    { id: 0, name: 'John' },
    { id: 1, name: 'Alex' }
  ]
});
//console output: 'admin name: John'

setTimeout(() => {
  store.update('users', {
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
import { createStore } from 'spawn-x';


class TodoApp {
  constructor(store) {
    this.store = store;
    this.store.detect('todos', () => combineActions(this.store.select('todos')));
  }

  addTask(task) {
    this.store.update('todos', this.store.select('todos').concat(task));
    this.store.update('@ACTIONS.ADD_TASK', new Date().getTime());
  }

  removeTask(id) {
    const filteredTasks = this.store
      .select('todos')
      .filter(task => task.id !== id);

    this.store.update('todos', filteredTasks);
    this.store.update('@ACTIONS.REMOVE_TASK', new Date().getTime());
  }

  completeTask(id, complete) {
    const updatedTasks = this.store
      .select('todos')
      .map(task => {
        if (task.id === id) {
          task.complete = complete;
        }

        return task;
      });

    this.store.update('todos', updatedTasks);
    this.store.update('@ACTIONS.CHANGE_COMPLETE', new Date().getTime());
  }
}

function combineActions(todos) {
  if (todos.length > 0) {
    console.log('-----');
    console.log('All todos: ', reportAction(todos));
    console.log('Completed todos:', getCountCompletedAction(todos));
  }
}

function reportAction (todos) {
  return todos.length;
}

function getCountCompletedAction(todos) {
  return todos.filter(todo => todo.complete === true).length;
}

function logger(store) {
  store.detect('*', () => {
    if (/@/.test(store.select('->'))) {
      console.log('logger: ', store.select('->') + ' -> ', store.select('*'));
    }
  });
}

///////////////////////////
const initialState = {
  todos: []
};
const store = createStore(initialState);
logger(store);

const app = new TodoApp(store);

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

app.removeTask(1);

/*
console output:

logger:  @@SPAWN/INIT -> ...
-----
All todos:  1
Completed todos: 1
logger: @ACTIONS.ADD_TASK -> ...
-----
All todos:  2
Completed todos: 2
logger: @ACTIONS.ADD_TASK -> ...
-----
All todos:  3
Completed todos: 2
logger: @ACTIONS.ADD_TASK -> ...
-----
All todos:  3
Completed todos: 3
logger: @ACTIONS.CHANGE_COMPLETE -> ...
-----
All todos:  2
Completed todos: 2
logger: @ACTIONS.REMOVE_TASK -> ...
*/
```
## LICENSE

MIT © [Alex Plex](https://github.com/atellmer)