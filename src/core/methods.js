function clone(target) {
  return JSON.parse(JSON.stringify(target));
}

function mapSubscribers(subscribers) {
  subscribers.forEach(cb => cb());
}

function checkCallback(subscribers, cb) {
  subscribers.forEach(item => {
    if (item === cb) return false;
  });

  return true;
}

function findZoneValue (zone, state) {
  let zoneParts = zone.split('.'),
      parent = clone(state);

  for (let i = 0; i < zoneParts.length; i++) {
    if (!parent.hasOwnProperty(zoneParts[i])) {
      return null;
    }
    parent = parent[zoneParts[i]];
  }

  return parent;
}

function plainZoneValue (zone, state) {
  return JSON.stringify(findZoneValue(zone, state));
}

function autorun(subscribers) {
  Object.keys(subscribers).forEach(key => mapSubscribers(subscribers[key]));
}

function compose(...funcs) {
  if (funcs.length === 0) return arg => arg;
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce((fn1, fn2) => (...args) => fn1(fn2(...args)));
}

function applyInterceptors(store) {
  return action => interceptors => compose(...interceptors.map(fn => fn(store)))(arg => arg)(clone(action));
}

function applyLogic({ zone, subscribers, state, prevState, afterUpdate }) {
  for (let key in subscribers) {
    if (subscribers.hasOwnProperty(key)) {
      if (key === zone) {
        mapSubscribers(subscribers[key]);
        continue;
      }
      if (zone.length < key.length && new RegExp('^' + '\\' + zone + '.', 'i').test(key)) {
        if (plainZoneValue(key, prevState) !== plainZoneValue(key, state)) {
          mapSubscribers(subscribers[key]);
          continue;
        }
      }
      if (zone.length > key.length && new RegExp('^' + '\\' + key + '.', 'i').test(zone)) {
        mapSubscribers(subscribers[key]);
        continue;
      }
    }
  }
  if (afterUpdate) {
    mapSubscribers(subscribers['*']);
  }
}

export {
  clone,
  mapSubscribers,
  checkCallback,
  findZoneValue,
  plainZoneValue,
  autorun,
  compose,
  applyInterceptors,
  applyLogic
}
