# spawn-x

### Reactive management for javaScript applications

![Spawn](./logo.jpg)

## About
Spawn is a simple and super small library (7 kb) without dependencies for reactive management of app state which use modified observer pattern, where instead names of events, uses zones - paths to data into app state. For optimization performance your app Spawn makes update app state, but does not runs the callbacks for this zone, if current data of zone equals previous data.


## install
With npm:
```
npm install spawn-x --save
```
With yarn:
```
yarn add spawn-x
```

```javascript
import { createStore } from 'spawn-x';

const store = createStore();
```
With bower:
```
bower install spawn-x --save
```
```html
<script src="path/to/spawn.js/lib/spawn.umd.min.js"></script>
```
```javascript
var store = Spawn.createStore();
```

## API:
#### Spawn exports 2 simple functions: createStore() and addInterceptor().

#### createStore()
This function needed for first initialize store.
```javascript
// Signature:
createStore(initialState?: any, addInterceptor?: func): instance
```
```javascript
// Examples
const store = createStore();

// with initial state
const initialState = {
  hello: 'world'
};
const store = createStore(initialState);
```

#### addInterceptor()
This function needed if you want to add interceptors (middlewares). For example interceptor may be as logger.
```javascript
addInterceptor(interceptor: func, ...): Array<interceptors>
```
```javascript
// Examples
const myLoggerInterceptor = store => next => action => {
  console.log('action: ', action);
  next(action);
}
const myOtherInterceptor = store => next => action => next(action);

const store = createStore({}, addInterceptor(myLoggerInterceptor, myOtherInterceptor));

//or without initialState
const store = createStore(addInterceptor(myLoggerInterceptor, myOtherInterceptor));
```

#### Store object after initialization will only have 3 methods: select(), detect(), update()

#### select()
Method return selected zone from app state. If zone will be equal '*', this method returns full app state. if zone will be a function, method puts the app state in the function argument and apply it.
```javascript
// Signature:
select(zone: string | func): any 
```
```javascript
// Examples:
store.select('roles.admins');
store.select('*'); // full app state
store.select(function (state) { return state.roles.admins[2] }); // ES5
store.select(state => state.roles.admins[2]); // ES2015
```

#### detect()
Method makes subscribe for data zone change and apply callback if zone updated. If zone will be equal '*', this method makes subscribe for all changes. Returns instance object. 

```javascript
// Signature:
detect(zone: string, callback: func): instance
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

#### update()
Method for updates zone. This method takes zone as first argument and action as second. Action must have 'data' field for your data and type. If zone will be equal '*', this method replaces app state on new state and apply all callbacks without checking. It is may be useful to implementation something like time traveling. Returns instance object.
```javascript
// Signature:
actionType {
  data: any,
  type: string
}

update(zone: string, action: actionType): instance
```
```javascript
// Examples:
const admins = [
  { id: 0, name: 'John Doe' },
  { id: 1, name: 'Alex Smith' },
  { id: 2, name: 'Kate Jensen' },
];
const myAction = {
  data: admins,
  type: 'UPDATE_ADMINS'
}
store.update('roles.admins', myAction);

//load app state from localStorage
const myAction = {
  data: JSON.parse(localStorage.getItem('APP_STATE_1')),
  type: 'LOAD_STATE'
}
store.update('*', myAction);
```

#### Note:
You can subscribe on not fully matching zones, and Spawn will apply callbacks correctly. For example: if you subscribe on 'grandpa.parent.child' and will update 'grandpa' or 'grandpa.parent', then 'grandpa.parent.child' will launch own callback if child value changes. If you subscribe on 'grandpa' and will update 'grandpa.parent' or 'grandpa.parent.child', then 'grandpa' will launch own callback without inspection.

#### Examples:
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
store.update('users',
    {
      data: {
        admins: [
          { id: 0, name: 'John' },
          { id: 1, name: 'Alex' }
        ]
      },
      type: 'UPDATE_USERS'
    }
  );
//console output: 'admin name: John'

setTimeout(() => {
  store.update('users', {
      data: {
        admins: [
          { id: 0, name: 'Jess' },
          { id: 1, name: 'Alex' }
        ]
      },
      type: 'UPDATE_USERS'
    }
  );
}, 2000);

//console output: 'admin name: Jess'
```
```javascript
//Example #2 (Simple app)
class TodoApp {
  constructor(store) {
    this.store = store;
    this.store.detect('todos', () => combineActions(this.store.select('todos')));
  }

  addTask(task) {
    const todos = this.store.select('todos').concat(task);
    this.store.update('todos', {
      data: todos,
      type: 'ADD_TASK'
    });
  }

  removeTask(id) {
    const filteredTasks = this.store
      .select('todos')
      .filter(task => task.id !== id);

    this.store.update('todos', {
      data: filteredTasks,
      type: 'REMOVE_TASK'
    });
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

    this.store.update('todos', {
      data: updatedTasks,
      type: 'CHANGE_COMPLETE'
    });
  }
}

function combineActions(todos) {
  if (todos.length > 0) {
    console.log('All todos: ', reportAction(todos));
    console.log('Completed todos:', getCountCompletedAction(todos));
    console.log('-----');
  }
}

function reportAction (todos) {
  return todos.length;
}

function getCountCompletedAction(todos) {
  return todos.filter(todo => todo.complete === true).length;
}

function logger(store) {
  return next => action => {
    console.log('action: ', action.type + ' -> ', action.data);
    next(action);
  }
}

///////////////////////////
const initialState = {
  todos: []
};

const store = createStore(
  initialState,
  addInterceptor(logger)
);

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

action:  @@SPAWN/INIT -> ...
-----
All todos:  1
Completed todos: 1
action: ADD_TASK -> ...
-----
All todos:  2
Completed todos: 2
action: ADD_TASK -> ...
-----
All todos:  3
Completed todos: 2
action: ADD_TASK -> ...
-----
All todos:  3
Completed todos: 3
action: CHANGE_COMPLETE -> ...
-----
All todos:  2
Completed todos: 2
action: REMOVE_TASK -> ...
*/
```
## LICENSE

MIT © [Alex Plex](https://github.com/atellmer)