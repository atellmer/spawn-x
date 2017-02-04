'use strict';

const {
  clone,
  mapSubscribers,
  checkCallback,
  findZoneValue,
  plainZoneValue,
  autorun,
  applyLogic
} = require('./core');
const {
  isPlainObject,
  isFunc,
  isString,
  error
} = require('./helpers');


let Spawn = (function () {
  let state = {},
      prevState = {},
      virtualState = {},
      subscribers = { '*': [] },
      lastZone = '@@SPAWN/INIT';

  const SpawnCreator = function () {
    const instance = this;

    if (arguments[0]) {
      if (!isPlainObject(arguments[0])) error('Spawn: the initial state must be plain object!');

      state = arguments[0];
    }

    Spawn = () => instance;

    instance.getState = () => clone(state);

    instance.select = (selector) => {
      if (isString(selector)) {
        switch (selector) {
        case '*':
          {
            return clone(state);
          }
        case '->':
          {
            return lastZone;
          }
        default:
          return findZoneValue(selector, state);
        }
      }
      if (isFunc(selector)) return selector(clone(state));

      error('Spawn: the select method takes only a string or function as argument!');
    }

    instance.detect = function (zone, callback) {
      if (!isString(zone)) error('Spawn: the detect method takes only a string for first argument!');
      if (!isFunc(callback)) error('Spawn: the detect method takes only a function for second argument!');

      if (!subscribers[zone]) {
        subscribers[zone] = [];
      }

      if (zone === '*' && checkCallback(subscribers[zone], callback)) {
        subscribers[zone].push(callback);

        return instance;
      }

      if (checkCallback(subscribers[zone], callback)) {
        subscribers[zone].push(callback);
      } else {
        return instance;
      }

      if (findZoneValue(zone, state)) {
        virtualState = clone(state);

        applyLogic(zone, subscribers);
      }

      return instance;
    }

    instance.update = function (zone, data) {
      if (!isString(zone)) error('Spawn: the update method takes only a string for first argument!');

      let zoneParts = zone.split('.'),
          parent = clone(state),
          newState = parent,
          key;

      if (zone === '*') {
        if (isPlainObject(data)) {
          state = clone(data);
          prevState = {};
          virtualState = {};
          autorun(subscribers, (key) => lastZone = key);

          return instance;
        }

        error('Spawn: the update method takes only a plain object for replace full state! Check your update(\'*\') method.');
      }

      lastZone = zone;

      for (let i = 0; i < zoneParts.length; i++) {
        if (!parent.hasOwnProperty(zoneParts[i])) {
          parent[zoneParts[i]] = {};
        }
        if (i === zoneParts.length - 1) {
          parent[zoneParts[i]] = data;
          break;
        }
        parent = parent[zoneParts[i]];
      }

      virtualState = clone(newState);

      if (plainZoneValue(zone, state) !== plainZoneValue(zone, virtualState)) {
        state = clone(virtualState);
        applyLogic(zone, subscribers);
        prevState = clone(virtualState);
      } else {
        mapSubscribers(subscribers['*']);
      }

      return instance;
    }
  }

  return SpawnCreator;
})();

module.exports = Spawn;
