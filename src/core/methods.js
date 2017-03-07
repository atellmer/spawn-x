import {
  isPlainObject,
  isArray
} from '../helpers';


function getImmutableCopy(target) {
  if (isPlainObject(target)) return { ...target };
  if (isArray(target)) return [ ...target ];

  return target;
}

function mapSubscribers(subscribers, subscribersArgs) {
  subscribers.forEach((cb, index) => cb(...subscribersArgs[index]));
}

function checkCallback(subscribers, cb) {
  subscribers.forEach(item => {
    if (item === cb) return false;
  });

  return true;
}

function removeCallback(subscribers, cb) {
  subscribers.forEach((item, index) => {
    if (item === cb) {
      subscribers.splice(index, 1);

      return true;
    }
  });

  return false;
}

function findZoneValue(zone, state) {
  let zoneParts = zone.split('.'),
      parent = state;

  for (let i = 0; i < zoneParts.length; i++) {
    if (!parent.hasOwnProperty(zoneParts[i])) {
      return null;
    }
    parent = parent[zoneParts[i]];
  }

  return parent;
}

function autorun(subscribers, subscribersArgs) {
  Object.keys(subscribers).forEach(key => mapSubscribers(subscribers[key], subscribersArgs[key]));
}

function compose(...funcs) {
  if (funcs.length === 0) return arg => arg;
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce((fn1, fn2) => (...args) => fn1(fn2(...args)));
}

function applyInterceptors(store) {
  return action => interceptors => compose(...interceptors.map(fn => fn(store)))(arg => arg)(action);
}

function applyLogic({
  zone,
  subscribers,
  subscribersArgs,
  afterUpdate
  }) {
  for (let key in subscribers) {
    if (subscribers.hasOwnProperty(key)) {
      if (key === zone) {
        mapSubscribers(subscribers[key], subscribersArgs[key]);
        continue;
      }
      if (zone.length < key.length && new RegExp('^' + '\\' + zone + '.', 'i').test(key)) {
        mapSubscribers(subscribers[key], subscribersArgs[key]);
        continue;
      }
      if (zone.length > key.length && new RegExp('^' + '\\' + key + '.', 'i').test(zone)) {
        mapSubscribers(subscribers[key], subscribersArgs[key]);
        continue;
      }
    }
  }
  if (afterUpdate) {
    mapSubscribers(subscribers['*'], subscribersArgs['*']);
  }
}

export {
  getImmutableCopy,
  mapSubscribers,
  checkCallback,
  removeCallback,
  findZoneValue,
  autorun,
  compose,
  applyInterceptors,
  applyLogic
}
