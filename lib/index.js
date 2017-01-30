var Spawn = (function () {
  'use strict';

  var state = {},
      prevState = {},
      virtualState = {},
      subscribers = {
        '*': []
      };
    
    var SpawnCreator = function () {
      var instance = this;

      if (arguments[0]) {
        if (!_isPlainObject(arguments[0])) {
          throw new Error ('Spawn: the initial state must be plain object!');
        }

        state = arguments[0];
      }

      Spawn = function () {
        return instance;
      }

      instance.getState = function () {
        return _clone(state);
      }

      instance.select = function (selector) {
        if (typeof selector === 'string') {
          if (selector === '*') {
            return _clone(state);
          }

          return _findZoneValue(selector, state);
        }
        if (typeof selector === 'function') {
          return selector(_clone(state));
        }

        throw new Error ('Spawn: the select method takes only a string or function as argument!');
      }

      instance.detect = function (zone, callback) {
        if (typeof zone !== 'string') {
          throw new Error ('Spawn: the detect method takes only a atring for first argument!');
        }

        if (typeof callback !== 'function') {
          throw new Error ('Spawn: the detect method takes only a function for second argument!');
        }

        if (!subscribers[zone]) {
          subscribers[zone] = [];
        }

        if (zone === '*' && _checkCallback(subscribers[zone], callback)) {
          subscribers[zone].push(callback);

          return instance;
        }

        if (_checkCallback(subscribers[zone], callback)) {
          subscribers[zone].push(callback);
        } else {
          return instance;
        }
       
        if (_findZoneValue(zone, state)) {
          virtualState = _clone(state);

          _applyLogic(zone);
        }

        return instance;
      }

      instance.update = function (zone, data) {
        if (typeof zone !== 'string') {
          throw new Error ('Spawn: the update method takes only a atring for first argument!');
        }

        var zoneParts = zone.split('.'),
            parent = _clone(state),
            newState = parent,
            key,
            i;

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

        virtualState = _clone(newState);

        if (JSON.stringify(_findZoneValue(zone, state)) !== JSON.stringify(_findZoneValue(zone, virtualState))) {
          state = _clone(virtualState);
          _applyLogic(zone);
          prevState = _clone(virtualState);
        }

        return instance;
      }

      function _findZoneValue(zone, state) {
        var zoneParts = zone.split('.'),
            parent = _clone(state),
            i;

        for (i = 0; i < zoneParts.length; i++) {
          if (!parent.hasOwnProperty(zoneParts[i])) {
            return null;
          }
          parent = parent[zoneParts[i]];
        }

        return parent;
      }

      function _applyLogic(zone) {
        var key,
            i;

        for (key in subscribers) {
          if (subscribers.hasOwnProperty(key)) {
            if (key === zone) {
              _mapSubscribers(subscribers[key]);
            } else {
              if (zone.length < key.length && new RegExp('^' + '\\' + zone + '.', 'i').test(key)) {
                if (JSON.stringify(_findZoneValue(key, prevState)) !== JSON.stringify(_findZoneValue(key, state))) {
                  _mapSubscribers(subscribers[key]);

                }
              }
              if (zone.length > key.length && new RegExp('^' + '\\' + key + '.', 'i').test(zone)) {
                _mapSubscribers(subscribers[key]);
              }
            }
          }
        }
        _mapSubscribers(subscribers['*']);
      }

      function _mapSubscribers(subscribersFromKey) {
        var i;

        for (i = 0; i < subscribersFromKey.length; i++) {
          subscribersFromKey[i]();
        }
      }

      function _clone(target) {
        return JSON.parse(JSON.stringify(target));
      }

      function _isPlainObject(target) {
        var stringTarget = Object.prototype.toString.call(target);

        if (typeof target === 'object' && stringTarget.slice(8, stringTarget.length - 1).toLowerCase() !== 'array') {
          return true;
        }

        return false;
      }

      function _checkCallback(subscribersFromZone, callback) {
        var i;

        for (i = 0; i < subscribersFromZone.length; i++) {
          if (subscribersFromZone[i] === callback) {
            return false;
          }
        }

        return true;
      }
    }

    return SpawnCreator;
})();

module.exports = Spawn;
