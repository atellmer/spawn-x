'use strict';

const test = require('tape');
const { createStore } = require('../lib/spawn.umd');

test(`createStore don't trows exeption`, (t) => {
  t.doesNotThrow(() => {
    createStore();
  });
  t.end();
});

test(`createStore with initial state don't trows exeption`, (t) => {
  t.doesNotThrow(() => {
    createStore({});
  });
  t.end();
});

test(`type of store is object`, (t) => {
  t.plan(1);

  const store = createStore();

  t.equal(typeof store, 'object');
});

test(`store has method`, (t) => {
  const store = createStore();

  t.doesNotThrow(() => {
    store.getState();
  }, `getState()`);

  t.doesNotThrow(() => {
    store.select('*');
  }, `select()`);

  t.doesNotThrow(() => {
    store.detect('*', () => {});
  }, `detect()`);

  t.doesNotThrow(() => {
    store.update('*', {});
  }, `update()`);

  t.end();
});

test(`Pass initial state`, (t) => {
  t.plan(1);

  const initilState = {
    users: [{
      name: 'Alex',
      age: 28
    }],
    tasks: []
  };

  const store = createStore(initilState);

  t.deepEqual(initilState, store.getState());
});

test(`Generate zone`, (t) => {
  t.plan(1);

  const actual = {
    grandpa: {
      parent: {
        child: 'Hello'
      }
    }
  };

  const store = createStore();

  store.update('grandpa.parent.child', 'Hello');

  t.deepEqual(actual, store.select('*'));
});

test(`return null if zone not exist`, (t) => {
  t.plan(1);

  const store = createStore();

  t.equal(null, store.select('some.zone'));
});

test(`return constant when init`, (t) => {
  t.plan(1);

  const store = createStore();

  t.equal('@@SPAWN/INIT', store.select('->'));
});

test(`[Update] state with update('*')`, (t) => {
  t.plan(1);

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

  store.update('*', actualState);

  t.deepEqual(actualState, store.select('*'));
});

test(`[Update] state with update('zone')`, (t) => {
  t.plan(1);

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

  store.update('users', users);

  const actualState = {
    users: users,
    tasks: []
  };

  t.deepEqual(actualState, store.select('*'));
});

test(`[Update] state with update('parent.child')`, (t) => {
  t.plan(1);

  const initilState = {
    parent: {
      child: 'Hello'
    }
  };
  const store = createStore(initilState);

  store.update('parent.child', 'Hello world');

  t.equal('Hello world', store.select('parent.child'));
});

test(`[Select] state with select('*')`, (t) => {
  t.plan(1);

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
      }, ]
    },
    tasks: []
  };
  const store = createStore(initilState);

  t.deepEqual(initilState, store.select('*'));
});

test(`[Select] state with select('->')`, (t) => {
  t.plan(3);

  const store = createStore();

  store.update('users', {});
  t.equal('users', store.select('->'));

  store.update('users.admins', {});
  t.equal('users.admins', store.select('->'));

  store.update('others', {});
  t.equal('others', store.select('->'));
});

test(`[Select] state with select('zone')`, (t) => {
  t.plan(1);

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
    }, ]
  };

  const initilState = {
    users: users,
    tasks: []
  };
  const store = createStore(initilState);

  t.deepEqual(users, store.select('users'));
});


test(`[Select] state with select('parent.child')`, (t) => {
  t.plan(1);

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
    }, ]
  };

  const initilState = {
    users: users,
    tasks: []
  };
  const store = createStore(initilState);

  t.deepEqual(admins, store.select('users.admins'));
});

test(`[Select] state with select(() => {})`, (t) => {
  t.plan(1);

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
      }, ]
    },
    tasks: []
  };
  const store = createStore(initilState);

  t.equal('Alex', store.select((state) => state.users.admins[0].name));
});

test(`[Detect] state with detect('*')`, (t) => {
  t.plan(3);

  let expected = 0;

  const store = createStore();

  store.detect('*', function () {
    expected++;
  });
  t.equal(1, expected);

  store.update('parent', {});
  t.equal(2, expected);

  store.update('parent.child', 'Hello world');
  t.equal(3, expected);
});

test(`[Detect] state with detect('zone')`, (t) => {
  t.plan(1);

  let len;

  const initilState = {
    users: [],
    tasks: []
  };
  const store = createStore(initilState);

  const callback = () => len = store.select('tasks').length;

  store.detect('tasks', callback);

  const tasks = store.select('tasks');

  tasks.push({
    name: 'task #1'
  });

  store.update('tasks', tasks);
  t.equal(1, len, `with detect('zone')`);
});

test(`[Detect] state with detect('parent.child')`, (t) => {
  t.plan(2);

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

  store.update('parent.child', 'Hello world');
  t.equal('Hello world', expected);
});


test(`Async update`, (t) => {
  t.plan(2);

  let expected;

  const store = createStore();

  function callback() {
    expected = store.select(state => state.users.admins[0].name);
  }

  store.detect('users.admins', callback);

  store.update('users', {
    admins: [{
        id: 0,
        name: 'John'
      },
      {
        id: 1,
        name: 'Alex'
      }
    ]
  });
  t.equal('John', expected);

  setTimeout(() => {
    store.update('users', {
      admins: [{
          id: 0,
          name: 'Jess'
        },
        {
          id: 1,
          name: 'Alex'
        }
      ]
    });

    t.equal('Jess', expected);
  }, 2000);
});


test(`Not apply callbacks if data not modified`, (t) => {
  let expected, count = 0;

  const store = createStore();

  store.detect('users.admin.name', () => {
    expected = store.select('users.admin.name');
    count++;
  });

  store.update('users', {
    admin: {
        id: 0,
        name: 'John'
      }
  });
  t.equal('John', expected);
  t.equal(1, count);

  setTimeout(() => {
    store.update('users', {
      admin: {
          id: 1000,
          name: 'John'
        }
    });
    t.equal('John', expected);
    t.equal(1, count);
    t.equal(1000, store.select('users.admin.id'));
  }, 1000);

  setTimeout(() => {
    store.update('users', {
      admin: {
          id: 0,
          name: 'Jess'
        }
    });

    t.equal('Jess', expected);
    t.equal(2, count);
    t.equal(0, store.select('users.admin.id'));
  }, 2000);

  setTimeout(() => {
    store.update('users', {
      admin: {
          id: 0,
          name: 'Jess',
          age: 23
        }
    });

    t.equal('Jess', expected);
    t.equal(2, count);
    t.equal(0, store.select('users.admin.id'));
    t.equal(23, store.select('users.admin.age'));
  }, 3000);

  t.end();
});
