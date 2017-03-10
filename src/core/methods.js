import {
  isPlainObject,
  isArray
} from '../helpers';


function getImmutableCopy(target) {
  if (isPlainObject(target)) return { ...target };
  if (isArray(target)) return [ ...target ];

  return target;
}

function mapSubscribers({
  subscribers,
  subscribersArgs,
  action
  }) {
  subscribers.forEach((cb, index) => cb(...subscribersArgs[index], action));
}

function checkCallback(subscribers, cb) {
  subscribers.forEach(item => {
    if (item === cb) return false;
  });

  return true;
}

function removeCallback({
  subscribers,
  subscribersArgs,
  cb
  }) {
  subscribers.forEach((item, index) => {
    if (item === cb) {
      subscribers.splice(index, 1);
      subscribersArgs.splice(index, 1);

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
  Object.keys(subscribers).forEach(key => mapSubscribers({
    subscribers: subscribers[key],
    subscribersArgs: subscribersArgs[key]
  }));
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
  action,
  zone,
  subscribers,
  subscribersArgs,
  afterUpdate
  }) {
  const keys = Object.keys(subscribers).filter(key => key !== '*');
  const zoneParts = zone.split('.');

  keys.forEach(key => {
    const keyParts = key.split('.');

    if (key === zone) {
      mapSubscribers({
        subscribers: subscribers[key],
        subscribersArgs: subscribersArgs[key]
      });
      return;
    }

    if (keyParts.length <= zoneParts.length) {
      let check = true;

      keyParts.forEach((keyPart, index) => {
        if (keyPart !== zoneParts[index]) {
          check = false;
          return;
        }
      });

      if (check) {
        mapSubscribers({
          subscribers: subscribers[key],
          subscribersArgs: subscribersArgs[key]
        });
      }
      return;
    }

    if (keyParts.length > zoneParts.length) {
      let check = true;

      zoneParts.forEach((zonePart, index) => {
        if (zonePart !== keyParts[index]) {
          check = false;
          return;
        }
      });

      if (check) {
        mapSubscribers({
          subscribers: subscribers[key],
          subscribersArgs: subscribersArgs[key]
        });
      }
      return;
    }
  });

  if (afterUpdate) {
    mapSubscribers({
      subscribers: subscribers['*'],
      subscribersArgs: subscribersArgs['*'],
      action
    });
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
