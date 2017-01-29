var Spawn = (function () {
  'use strict';

  var state = {},
      prevState = {},
      virtualState = {},
      subscribers = {};
    
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

      instance.select = function (zone) {
        if (zone === '*') {
          return _clone(state);
        }

        return _findZoneValue(zone, state);
      }

      instance.detect = function (zone, callback) {
        if (typeof callback !== 'function') {
          throw new Error ('Spawn: the detect method takes only a function for second argument!');

          return instance;
        }
        if (!subscribers[zone]) {
          subscribers[zone] = [];
        }
        subscribers[zone].push(callback);

        if (_findZoneValue(zone, state)) {
          virtualState = _clone(state);

          _applyLogic(zone);
        }

        return instance;
      }

      instance.update = function (zone, data) {
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
              _mapSubscribers(key);
            } else {
              if (zone.length < key.length && new RegExp('^' + zone + '.', 'i').test(key)) {
                if (_findZoneValue(key, prevState) !== _findZoneValue(key, state)) {
                  _mapSubscribers(key);
                }
              }
              if (zone.length > key.length && new RegExp('^' + key + '.', 'i').test(zone)) {
                _mapSubscribers(key);
              }
            }
          }
        }
      }

      function _mapSubscribers(key) {
        var i;

        for (i = 0; i < subscribers[key].length; i++) {
          subscribers[key][i]();
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
    }

    return SpawnCreator;
})();

module.exports = Spawn;
