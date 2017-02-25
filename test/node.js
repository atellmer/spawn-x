'use strict';

const test = require('tape');
const Spawn = require('../src/node/index');

test(`NODE: Spawn don't trows exeption`, (t) => {
  t.doesNotThrow(() => {
    new Spawn({});
  });
  t.end();
});

test(`NODE: Spawn created`, (t) => {
  t.plan(1);

  const spawn$ = new Spawn({});

  t.equal(typeof spawn$, 'object');
});

test(`NODE: Spawn instance has method`, (t) => {
  const spawn$ = new Spawn({});

  t.doesNotThrow(() => {
    spawn$.getState();
  }, `getState()`);

  t.doesNotThrow(() => {
    spawn$.select('*');
  }, `select()`);

  t.doesNotThrow(() => {
    spawn$.detect('*', () => {});
  }, `detect()`);

  t.doesNotThrow(() => {
    spawn$.update('*', {});
  }, `update()`);

  t.end();
});

test(`NODE: Pass initial state`, (t) => {
  t.plan(1);

  const initilState = {
    users: [{
      name: 'Alex',
      age: 28
    }],
    tasks: []
  };

  const spawn$ = new Spawn(initilState);

  t.deepEqual(initilState, spawn$.getState());
});

test(`NODE: Generate zone`, (t) => {
  t.plan(1);

  const actual = {
    grandpa: {
      parent: {
        child: 'Hello'
      }
    }
  };

  const spawn$ = new Spawn({});

  spawn$.update('grandpa.parent.child', 'Hello');

  t.deepEqual(actual, spawn$.select('*'));
});

test(`NODE: return null if zone not exist`, (t) => {
  t.plan(1);

  const spawn$ = new Spawn({});

  t.equal(null, spawn$.select('some.zone'));
});

test(`NODE: return constant when init`, (t) => {
  t.plan(1);

  const spawn$ = new Spawn({});

  t.equal('@@SPAWN/INIT', spawn$.select('->'));
});

test(`NODE: [Update] state with update('*')`, (t) => {
  t.plan(1);

  const initilState = {
    users: [{
      name: 'Alex',
      age: 28
    }],
    tasks: []
  };
  const spawn$ = new Spawn(initilState);

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

  spawn$.update('*', actualState);

  t.deepEqual(actualState, spawn$.select('*'));
});

test(`NODE: [Update] state with update('zone')`, (t) => {
  t.plan(1);

  const initilState = {
    users: [{
      name: 'Alex',
      age: 28
    }],
    tasks: []
  };
  const spawn$ = new Spawn(initilState);

  const users = [{
      name: 'Alex',
      age: 28
    },
    {
      name: 'July',
      age: 27
    }
  ];

  spawn$.update('users', users);

  const actualState = {
    users: users,
    tasks: []
  };

  t.deepEqual(actualState, spawn$.select('*'));
});

test(`NODE: [Update] state with update('parent.child')`, (t) => {
  t.plan(1);

  const initilState = {
    parent: {
      child: 'Hello'
    }
  };
  const spawn$ = new Spawn(initilState);

  spawn$.update('parent.child', 'Hello world');

  t.equal('Hello world', spawn$.select('parent.child'));
});

test(`NODE: [Select] state with select('*')`, (t) => {
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
  const spawn$ = new Spawn(initilState);

  t.deepEqual(initilState, spawn$.select('*'));
});

test(`NODE: [Select] state with select('->')`, (t) => {
  t.plan(3);

  const spawn$ = new Spawn({});

  spawn$.update('users', {});
  t.equal('users', spawn$.select('->'));

  spawn$.update('users.admins', {});
  t.equal('users.admins', spawn$.select('->'));

  spawn$.update('others', {});
  t.equal('others', spawn$.select('->'));
});

test(`NODE: [Select] state with select('zone')`, (t) => {
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
  const spawn$ = new Spawn(initilState);

  t.deepEqual(users, spawn$.select('users'));
});


test(`NODE: [Select] state with select('parent.child')`, (t) => {
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
  const spawn$ = new Spawn(initilState);

  t.deepEqual(admins, spawn$.select('users.admins'));
});

test(`NODE: [Select] state with select(() => {})`, (t) => {
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
  const spawn$ = new Spawn(initilState);

  t.equal('Alex', spawn$.select((state) => state.users.admins[0].name));
});


test(`NODE: [Detect] state with detect('*')`, (t) => {
  t.plan(3);

  let expected = 0;

  const spawn$ = new Spawn({});

  spawn$.detect('*', function () {
    expected++;
  });
  t.equal(1, expected);

  spawn$.update('parent', {});
  t.equal(2, expected);

  spawn$.update('parent.child', 'Hello world');
  t.equal(3, expected);
});

test(`NODE: [Detect] state with detect('zone')`, (t) => {
  t.plan(1);

  let len;

  const initilState = {
    users: [],
    tasks: []
  };
  const spawn$ = new Spawn(initilState);

  const callback = () => len = spawn$.select('tasks').length;

  spawn$.detect('tasks', callback);

  const tasks = spawn$.select('tasks');

  tasks.push({
    name: 'task #1'
  });

  spawn$.update('tasks', tasks);
  t.equal(1, len, `with detect('zone')`);
});

test(`NODE: [Detect] state with detect('parent.child')`, (t) => {
  t.plan(2);

  let expected;

  const initilState = {
    parent: {
      child: 'Hello'
    },
  };
  const spawn$ = new Spawn(initilState);

  spawn$.detect('parent.child', () => {
    expected = spawn$.select('parent.child');
  });
  t.equal('Hello', expected);

  spawn$.update('parent.child', 'Hello world');
  t.equal('Hello world', expected);
});


test(`NODE: Async update`, (t) => {
  t.plan(2);

  let expected;

  const spawn$ = new Spawn({});

  function callback() {
    expected = spawn$.select(state => state.users.admins[0].name);
  }

  spawn$.detect('users.admins', callback);

  spawn$.update('users', {
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
    spawn$.update('users', {
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


test(`NODE: Not apply callbacks if data not modified`, (t) => {
  let expected, count = 0;

  const spawn$ = new Spawn({});

  spawn$.detect('users.admin.name', () => {
    expected = spawn$.select('users.admin.name');
    count++;
  });

  spawn$.update('users', {
    admin: {
        id: 0,
        name: 'John'
      }
  });
  t.equal('John', expected);
  t.equal(1, count);

  setTimeout(() => {
    spawn$.update('users', {
      admin: {
          id: 1000,
          name: 'John'
        }
    });
    t.equal('John', expected);
    t.equal(1, count);
    t.equal(1000, spawn$.select('users.admin.id'));
  }, 1000);

  setTimeout(() => {
    spawn$.update('users', {
      admin: {
          id: 0,
          name: 'Jess'
        }
    });

    t.equal('Jess', expected);
    t.equal(2, count);
    t.equal(0, spawn$.select('users.admin.id'));
  }, 2000);

  setTimeout(() => {
    spawn$.update('users', {
      admin: {
          id: 0,
          name: 'Jess',
          age: 23
        }
    });

    t.equal('Jess', expected);
    t.equal(2, count);
    t.equal(0, spawn$.select('users.admin.id'));
    t.equal(23, spawn$.select('users.admin.age'));
  }, 3000);

  t.end();
});
