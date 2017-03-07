'use strict';

const test = require('tape');
const { createStore, addInterceptor } = require('../lib/spawn.umd');


test(`addInterceptor don't trows exeption`, (t) => {
  t.doesNotThrow(() => {
    addInterceptor();
  });
  t.end();
});

test(`addInterceptor don't trows exeption when passes a functions`, (t) => {
  t.doesNotThrow(() => {
    addInterceptor(
      store => next => action => next(action),
      store => next => action => next(action),
      store => next => action => next(action)
    );
  });
  t.end();
});

test(`addInterceptor trows exeption when passes not a functions`, (t) => {
  t.throws(() => {
    addInterceptor(
      store => next => action => next(action),
      store => next => action => next(action),
      true
    );
  });
  t.end();
});

test(`addInterceptor return array of functions`, (t) => {
  const fn = store => next => action => next(action);

  const expected = [
    fn,
    fn,
    fn,
  ];

  const actual = addInterceptor(
    fn,
    fn,
    fn
  );

  t.deepEqual(actual, expected);
  t.end();
});

test(`createStore don't trows exeption`, (t) => {
  t.doesNotThrow(() => {
    createStore();
  });
  t.end();
});

test(`createStore don't trows exeption without arguments`, (t) => {
  t.doesNotThrow(() => {
    createStore();
  });
  t.end();
});

test(`createStore don't trows exeption with one argument as plain object`, (t) => {
  t.doesNotThrow(() => {
    createStore({});
  });
  t.end();
});

test(`createStore don't trows exeption with one argument as addInterceptor function`, (t) => {
  t.doesNotThrow(() => {
    createStore(addInterceptor(store => next => action => next(action)));
  });
  t.end();
});

test(`createStore don't trows exeption with two arguments as plain object and addInterceptor function`, (t) => {
  t.doesNotThrow(() => {
    createStore({}, addInterceptor(store => next => action => next(action)));
  });
  t.end();
});

test(`createStore trows exeption with one argument as not plain object or not addInterceptor function`, (t) => {
  t.throws(() => {
    createStore(true);
  });
  t.end();
});

test(`createStore trows exeption with two arguments as not plain object and addInterceptor function`, (t) => {
  t.throws(() => {
    createStore([], addInterceptor(store => next => action => next(action)));
  });
  t.end();
});

test(`createStore trows exeption with two arguments as plain object and not addInterceptor function`, (t) => {
  t.throws(() => {
    createStore({}, {});
  });
  t.end();
});

test(`type of store is object`, (t) => {
  const store = createStore();

  t.equal(typeof store, 'object');
  t.end();
});

test(`store has method`, (t) => {
  const store = createStore();

  t.doesNotThrow(() => {
    store.select('*');
  }, `select()`);

  t.doesNotThrow(() => {
    store.detect('*', () => { });
  }, `detect()`);

  t.doesNotThrow(() => {
    store.reject('*', () => { });
  }, `reject()`);

  t.doesNotThrow(() => {
    store.update('*', { data: {}, type: 'TEST_TYPE' });
  }, `update()`);

  t.end();
});

test(`addInterceptor with one interceptor right updated state`, (t) => {
  const interceptor = store => next => action => next(action);

  const store = createStore(
    {},
    addInterceptor(interceptor)
  );

  const action = {
    data: { name: 'Alex' },
    type: 'ADD_USER'
  };

  store.update('users', action);

  t.deepEqual(action.data, store.select('users'));

  t.end();
});

test(`addInterceptor with two interceptor right updated state`, (t) => {
  const interceptorOne = store => next => action => next(action);
  const interceptorTwo = store => next => action => next(action);

  const store = createStore(
    {},
    addInterceptor(interceptorOne, interceptorTwo)
  );

  const action = {
    data: { name: 'Alex' },
    type: 'ADD_USER'
  };

  store.update('users', action);

  t.deepEqual(action.data, store.select('users'));

  t.end();
});

test(`addInterceptor with modified action`, (t) => {
  const interceptorOne = store => next => action => {
    action.data.name = 'John';
    next(action);
  }

  const interceptorTwo = store => next => action => {
    next(action);
  }

  const store = createStore(
    {},
    addInterceptor(interceptorOne, interceptorTwo)
  );

  const action = {
    data: { name: 'Alex' },
    type: 'ADD_USER'
  };

  store.update('users', action);

  t.equal('John', store.select('users.name'));

  t.end();
});

test(`addInterceptor with cancelable action`, (t) => {
  const interceptorOne = store => next => action => {
    if (!action.data.cancelable) {
      next(action);
    }
  }

  const interceptorTwo = store => next => action => {
    next(action);
  }

  const store = createStore(
    {},
    addInterceptor(interceptorOne, interceptorTwo)
  );

  const action = {
    data: {
      name: 'Alex',
      cancelable: true
    },
    type: 'ADD_USER'
  };

  store.update('users', action);

  t.equal(null, store.select('users'));

  t.end();
});

test(`Pass initial state`, (t) => {
  const initilState = {
    users: [{
      name: 'Alex',
      age: 28
    }],
    tasks: []
  };

  const store = createStore(initilState);

  t.deepEqual(initilState, store.select('*'));

  t.end();
});

test(`Generate zone`, (t) => {
  const actual = {
    grandpa: {
      parent: {
        child: 'Hello'
      }
    }
  };

  const store = createStore();

  store.update('grandpa.parent.child', { data: 'Hello', type: 'TEST_TYPE' });

  t.deepEqual(actual, store.select('*'));

  t.end();
});

test(`return null if zone not exist`, (t) => {
  const store = createStore();

  t.equal(null, store.select('some.zone'));

  t.end();
});

test(`[Update] state with update('*')`, (t) => {
  const initilState = {
    users: [{
      name: 'Alex',
      age: 28
    }],
    tasks: []
  };
  const store = createStore(initilState);

  const actualState = {
    users: [{
      name: 'Alex',
      age: 28
    },
    {
      name: 'July',
      age: 27
    }
    ],
    tasks: []
  };

  store.update('*', { data: actualState, type: 'LOAD_INIT_DATA' });

  t.deepEqual(actualState, store.select('*'));

  t.end();
});

test(`[Update] state with update('zone')`, (t) => {
  const initilState = {
    users: [{
      name: 'Alex',
      age: 28
    }],
    tasks: []
  };
  const store = createStore(initilState);

  const users = [{
    name: 'Alex',
    age: 28
  },
  {
    name: 'July',
    age: 27
  }
  ];

  store.update('users', { data: users, type: 'UPDATE_USERS' });

  const actualState = {
    users: users,
    tasks: []
  };

  t.deepEqual(actualState, store.select('*'));

  t.end();
});

test(`[Update] state with update('parent.child')`, (t) => {
  const initilState = {
    parent: {
      child: 'Hello'
    }
  };
  const store = createStore(initilState);

  store.update('parent.child', { data: 'Hello world', type: 'TEST_TYPE' });

  t.equal('Hello world', store.select('parent.child'));

  t.end();
});

test(`[Select] state with select('*')`, (t) => {
  const initilState = {
    users: {
      admins: [{
        name: 'Alex',
        age: 28
      },
      {
        name: 'July',
        age: 27
      }
      ],
      others: [{
        name: 'Paul',
        age: 26
      },]
    },
    tasks: []
  };
  const store = createStore(initilState);

  t.deepEqual(initilState, store.select('*'));

  t.end();
});

test(`[Select] state with select('zone')`, (t) => {
  const users = {
    admins: [{
      name: 'Alex',
      age: 28
    },
    {
      name: 'July',
      age: 27
    }
    ],
    others: [{
      name: 'Paul',
      age: 26
    },]
  };

  const initilState = {
    users: users,
    tasks: []
  };
  const store = createStore(initilState);

  t.deepEqual(users, store.select('users'));

  t.end();
});

test(`[Select] state with select('parent.child')`, (t) => {
  const admins = [{
    name: 'Alex',
    age: 28
  },
  {
    name: 'July',
    age: 27
  }
  ];

  const users = {
    admins: admins,
    others: [{
      name: 'Paul',
      age: 26
    },]
  };

  const initilState = {
    users: users,
    tasks: []
  };
  const store = createStore(initilState);

  t.deepEqual(admins, store.select('users.admins'));

  t.end();
});

test(`[Select] state with select(() => {})`, (t) => {
  const initilState = {
    users: {
      admins: [{
        name: 'Alex',
        age: 28
      },
      {
        name: 'July',
        age: 27
      }
      ],
      others: [{
        name: 'Paul',
        age: 26
      },]
    },
    tasks: []
  };
  const store = createStore(initilState);

  t.equal('Alex', store.select((state) => state.users.admins[0].name));

  t.end();
});

test(`[Detect] state with detect('*')`, (t) => {
  let expected = 0;

  const store = createStore();

  store.detect('*', () => expected++);

  t.equal(1, expected);

  store.update('parent', { data: {}, type: 'TEST_TYPE' });
  t.equal(2, expected);

  store.update('parent.child', { data: 'Hello World', type: 'TEST_TYPE' });
  t.equal(3, expected);

  t.end();
});

test(`[Detect] state with detect('zone')`, (t) => {
  let len;

  const initilState = {
    users: [],
    tasks: []
  };
  const store = createStore(initilState);

  const callback = () => len = store.select('tasks').length;

  store.detect('tasks', callback);

  let tasks = store.select('tasks').concat({ name: 'task #1' });

  store.update('tasks', { data: tasks, type: 'UPDATE_TASKS' });
  t.equal(1, len, `with detect('zone')`);

  t.end();
});

test(`[Detect] state with detect('parent.child')`, (t) => {

  let expected;

  const initilState = {
    parent: {
      child: 'Hello'
    },
  };
  const store = createStore(initilState);

  store.detect('parent.child', () => {
    expected = store.select('parent.child');
  });
  t.equal('Hello', expected);

  store.update('parent.child', { data: 'Hello world', type: 'SOME_UPDATE' });
  t.equal('Hello world', expected);

  t.end();
});


test(`[Reject] callback`, (t) => {
  let len;

  const initilState = {
    new: {
      tasks: []
    }
  };
  const store = createStore(initilState);

  const callback = () => len = store.select('new.tasks').length;

  store.detect('new.tasks', callback);

  store.update('new.tasks', { data: store.select('new.tasks').concat({ name: 'task #1' }), type: 'UPDATE_TASKS' });
  t.equal(1, len);

  store.update('new.tasks', { data: store.select('new.tasks').concat({ name: 'task #2' }), type: 'UPDATE_TASKS' });
  t.equal(2, len);

  store.reject('new.tasks', callback);

  store.update('new.tasks', { data: store.select('new.tasks').concat({ name: 'task #3' }), type: 'UPDATE_TASKS' });
  t.equal(2, len);

  t.end();
});


test(`Async update`, (t) => {
  let expected;

  const store = createStore();

  function callback() {
    expected = store.select(state => state.users.admins[0].name);
  }

  store.detect('users.admins', callback);

  store.update('users',
    {
      data: {
        admins: [{
          id: 0,
          name: 'John'
        },
        {
          id: 1,
          name: 'Alex'
        }
        ]
      },
      type: 'UPDATE_USERS'
    }
  );
  t.equal('John', expected);

  setTimeout(() => {
    store.update('users',
      {
        data: {
          admins: [{
            id: 0,
            name: 'Jess'
          },
          {
            id: 1,
            name: 'Alex'
          }
          ]
        },
        type: 'UPDATE_USERS'
      }
    );

    t.equal('Jess', expected);
  }, 2000);

  t.end();
});

test(`Not apply callbacks if data not modified`, (t) => {
  let expected, count = 0;

  const store = createStore();

  store.detect('users.admin.name', () => {
    expected = store.select('users.admin.name');
    count++;
  });

  store.update('users', {
      data: {
        admin: {
          id: 0,
          name: 'John'
        }
      },
      type: 'UPDATE_USERS'
    }
  );
  t.equal('John', expected);
  t.equal(1, count);

  setTimeout(() => {
    store.update('users', {
      data: {
        admin: {
          id: 1000,
          name: 'John'
        }
      },
      type: 'UPDATE_USERS'
    });
    t.equal('John', expected);
    t.equal(1, count);
    t.equal(1000, store.select('users.admin.id'));
  }, 1000);

  setTimeout(() => {
    store.update('users', {
      data: {
        admin: {
          id: 0,
          name: 'Jess'
        }
      },
      type: 'UPDATE_USERS'
    });

    t.equal('Jess', expected);
    t.equal(2, count);
    t.equal(0, store.select('users.admin.id'));
  }, 2000);

  setTimeout(() => {
    store.update('users', {
      data: {
        admin: {
          id: 0,
          name: 'Jess',
          age: 23
        }
      },
      type: 'UPDATE_USERS'
    });

    t.equal('Jess', expected);
    t.equal(2, count);
    t.equal(0, store.select('users.admin.id'));
    t.equal(23, store.select('users.admin.age'));
  }, 3000);

  t.end();
});
