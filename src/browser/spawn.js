var Spawn = (function () {
  'use strict';

  var state = {},
      prevState = {},
      virtualState = {},
      subscribers = { '*': [] },
      lastZone = '@@SPAWN/INIT';

  var SpawnCreator = function () {
    var instance = this;

    if (arguments[0]) {
      if (!isPlainObject(arguments[0])) error('Spawn: the initial state must be plain object!');

      state = arguments[0];
    }

    Spawn = function () {
      return instance;
    }

    instance.getState = function () {
      return clone(state);
    }

    instance.select = function (selector) {
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
      if (isFunc(selector)) {
        return selector(clone(state));
      }

      throw new Error('Spawn: the select method takes only a string or function as argument!');
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

      var zoneParts = zone.split('.'),
          parent = clone(state),
          newState = parent,
          key,
          i;

      if (zone === '*') {
        if (isPlainObject(data)) {
          state = clone(data);
          prevState = {};
          virtualState = {};
          autorun(subscribers, function(key) {
            lastZone = key;
          });

          return instance;
        }

        error('Spawn: the update method takes only a plain object for replace full state! Check your update(\'*\') method.');
      }

      lastZone = zone;

      for (i = 0; i < zoneParts.length; i++) {
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

    function findZoneValue(zone, state) {
      var zoneParts = zone.split('.'),
          parent = clone(state),
          i;

      for (i = 0; i < zoneParts.length; i++) {
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

    function applyLogic(zone, subscribers) {
      var key;

      for (key in subscribers) {
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
      mapSubscribers(subscribers['*']);
    }

    function autorun(subscribers, cb) {
      var key;

      for (key in subscribers) {
        if (subscribers.hasOwnProperty(key)) {
          cb(key);
          mapSubscribers(subscribers[key]);
          mapSubscribers(subscribers['*']);
        }
      }
    }

    function mapSubscribers(subscribers) {
      var i;

      for (i = 0; i < subscribers.length; i++) {
        subscribers[i]();
      }
    }

    function checkCallback(subscribers, callback) {
      var i;

      for (i = 0; i < subscribers.length; i++) {
        if (subscribers[i] === callback) {
          return false;
        }
      }

      return true;
    }

    function clone(target) {
      return JSON.parse(JSON.stringify(target));
    }

    function isPlainObject(target) {
      return isObject(target) && !isArray(target) ? true : false;
    }

    function isObject(target) {
      return typeof target === 'object';
    }

    function isArray(target) {
      var stringTarget = Object.prototype.toString.call(target);
      return stringTarget.slice(8, stringTarget.length - 1).toLowerCase() === 'array';
    }

    function isFunc(target) {
      return typeof target === 'function';
    }

    function isString(target) {
      return typeof target === 'string';
    }

    function error(message) {
      throw new Error(message);
    }
  }

  return SpawnCreator;
})();
