# spawn-x

### Reactive management for javaScript applications

![Spawn](./assets/cover.jpg)

## About
Spawn is a simple and super small library (8 kb) without dependencies for reactive management of app state which use modified observer pattern, where instead names of events, uses zones - paths to data into app state.

You can use Spawn independently with another libraryes.
Also you may be interested: 
* [spawn-x-effects](https://github.com/atellmer/spawn-x-effects) (Interceptor for cascade update)
* [react-spawn-x](https://github.com/atellmer/react-spawn-x) (React connector for Spawn)
* [angular-spawn-x](https://github.com/atellmer/angular-spawn-x) (Angular connector for Spawn)
* [angularjs-spawn-x](https://github.com/atellmer/angularjs-spawn-x) (AngularJS connector for Spawn)


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
<script src="path/to/spawn-x/lib/spawn-x.umd.min.js"></script>
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

#### Store object after initialization will only have 4 methods: select(), detect(), reject(), update()

#### select()
Method return selected zone from app state. If zone will be equal '*', this method returns full app state. if zone will be a function, method puts the app state in the function argument and apply it.
```javascript
// Signature:
select(zone: string | func): any 
```
```javascript
// Examples:
store.select('foo.bar');
store.select('*'); // full app state
store.select(state => state.foo.bar[2]); // ES2015
store.select(function (state) { return state.foo.bar[2] }); // ES5
```

#### detect()
Method makes subscribe for data zone change and apply callback if zone updated. If zone will be equal '*', this method makes subscribe for all changes. Returns instance object. 

```javascript
// Signature:
detect(zone: string, callback: func): instance
```
```javascript
// Examples:
const callback = () => {
  const data = store.select('foo.bar');
}

store.detect('foo.bar', callback);

store.detect('*', () => {
  console.log('something happened!');
});

//with receipt of action
store.detect('*', action => {
  if (action.type === 'KARAMBA') {
      store.update('foo', { data: 'bar', type: 'KARAMBA_DETECTED' })
  }
});
```
#### reject()
Method for the removal of a callback (unsubscribe).

```javascript
// Signature:
reject(zone: string, callback: func): instance
```
```javascript
// Examples:
const callback = () => {
  const admins = store.select('foo.bar');
}

store.reject('foo.bar', callback);
```

#### update()
Method for updates zone. This method takes zone as first argument and action as second. Action must have 'data' field for your data and type. If zone will be equal '*', this method replaces app state on new state and apply all callbacks. It is may be useful to implementation something like time traveling. Returns instance object.
```javascript
// Signature:
interface IAction {
  data: any;
  type: string;
}

update(zone: string, action: IAction): instance
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
  data: JSON.parse(localStorage.getItem('APP_STATE')),
  type: 'LOAD_STATE'
}
store.update('*', myAction);
```

#### Note:
You can subscribe on not fully matching zones, and Spawn will runs callbacks correctly. For example: if you subscribe on 'grandpa.parent.child' and will update 'grandpa' or 'grandpa.parent', then 'grandpa.parent.child' will launch own callback. in its turn, if you subscribe on 'grandpa' and will update 'grandpa.parent' or 'grandpa.parent.child', then 'grandpa' will launch own callback.

#### Example #1
```javascript
import { createStore } from 'spawn-x';


const store = createStore();

function callback() {
  console.log('name: ', store.select(state => state.users.admins[0].name));
}

//subscribe only on users.admins
store.detect('users.admins', callback);

//update users
store.update('users', {
  data: {
    admins: [
      { id: 0, name: 'John' },
      { id: 1, name: 'Alex' }
    ]
  },
  type: 'UPDATE_USERS'
});
//console output: 'name: John'

setTimeout(() => {
  store.update('users', {
    data: {
      admins: [
        { id: 0, name: 'Jess' },
        { id: 1, name: 'Alex' }
      ],
      some: 'text'
    },
    type: 'UPDATE_USERS'
  });
}, 2000);

//console output: 'name: Jess'
```
#### Example #2 "Simple todo app"
```javascript
import { createStore, addInterceptor } from 'spawn-x';


class TodoApp {
  constructor(store) {
    this.store = store;
    this.store.detect('today.tasks', () => combineActions(this.store.select('today.tasks')));
  }

  addTask(task) {
    const tasks = this.store
      .select('today.tasks')
      .concat(task);

    this.store.update('today.tasks', {
      data: tasks,
      type: 'ADD_TASK'
    });
  }

  removeTask(id) {
    const filteredTasks = this.store
      .select('today.tasks')
      .filter(task => task.id !== id);

    this.store.update('today.tasks', {
      data: filteredTasks,
      type: 'REMOVE_TASK'
    });
  }

  completeTask(id, complete) {
    const updatedTasks = this.store
      .select('today.tasks')
      .map(task => {
        if (task.id === id) {
          task.complete = complete;
        }

        return task;
      });

    this.store.update('today.tasks', {
      data: updatedTasks,
      type: 'CHANGE_COMPLETE'
    });
  }
}

function combineActions(todos) {
  console.log('All todos: ', reportAction(todos));
  console.log('Completed todos:', getCountCompletedAction(todos));
  console.log('-----');
}

function reportAction (todos) {
  return todos.length;
}

function getCountCompletedAction(todos) {
  return todos.filter(todo => todo.complete === true).length;
}

function logger(store) {
  return next => action => {
    console.log('action: ', action.type + ' -> ',  JSON.parse(JSON.stringify(action.data)));
    next(action);
  }
}

///////////////////////////
const initialState = {
  today: {
    tasks: []
  }
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
All todos:  0
Completed todos: 0
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
#### Example #3 "Redux-like style"
```javascript
import { createStore } from 'spawn-x';


const btn = document.querySelector('#addTrack');
const input = document.querySelector('#input');
const list = document.querySelector('#trackList');

const store = createStore();

// Constants
const ADD_TRACK = 'ADD_TRACK';
const RENDER_TRACKS = 'RENDER_TRACKS';
const UPDATE_STORE = 'UPDATE_STORE';

// fake Reducer
store.detect('*', action => {
  console.log(action);

  switch(action.type) {
    case ADD_TRACK: {
      store.update('tracks', { 
        type: UPDATE_STORE,
        data: store.select('tracks') ? store.select('tracks').concat(action.data) : [].concat(action.data)
      });
    }
  }
});

// Action Creators
const addTrack = data => {
  store.update('', { 
    type: ADD_TRACK,
    data: data
  });
}

const renderTracks = () => {
  list.innerHTML = '';

  store
  .select('tracks')
  .forEach(item => {
    const li = document.createElement('li');

    li.textContent = item;
    list.appendChild(li);
  });

  store.update('', { 
    type: RENDER_TRACKS,
    data: null
  });
}

btn.addEventListener('click', () => {
  addTrack(input.value);
  renderTracks();
  input.value = '';
});
```

## LICENSE

MIT © [Alex Plex](https://github.com/atellmer)