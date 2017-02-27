const SPAWN_INIT = '@@SPAWN/INIT';

function clone(target) {
  return JSON.parse(JSON.stringify(target));
}

function mapSubscribers(subscribers) {
  subscribers.forEach(item => item());
}

function checkCallback(subscribers, cb) {
  subscribers.forEach(item => {
    if (item === cb) return false;
  });

  return true;
}

function findZoneValue(zone, state) {
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

function plainZoneValue(zone, state) {
  return JSON.stringify(findZoneValue(zone, state));
}

function autorun(subscribers, cb) {
  for (let key in subscribers) {
    if (subscribers.hasOwnProperty(key)) {
      if (key !== '*') cb(key);
      mapSubscribers(subscribers[key]);
    }
  }
}

function applyLogic(zone, subscribers, state, prevState, afterUpdate) {
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
  SPAWN_INIT,
  clone,
  mapSubscribers,
  checkCallback,
  findZoneValue,
  plainZoneValue,
  autorun,
  applyLogic
}
