var Spawn = (function () {
	'use strict';

	return (function () {
		var state = {},
				prevState = {},
				virtualState = {},
				subscribers = {};

		var SpawnCreator = function () {
			var instance = this;

			if (arguments[0] && typeof arguments[0] === 'object') {
				state = arguments[0];
			}

			Spawn = function () {
				return instance;
			}

			instance.getState = function () {
				return _clone(state);
			}

			instance.detect = function (zone, callback) {
				if (typeof callback !== 'function') {
					console.warn('Detect method takes only a function!');
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
						return false;
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
							if (zone.length < key.length && key.match(new RegExp('^' + zone + '.', 'i')) !== null) {
								if (_findZoneValue(key, prevState) !== _findZoneValue(key, state)) {
									_mapSubscribers(key);
								}
							}
							if (zone.length > key.length && zone.match(new RegExp('^' + key + '.', 'i')) !== null) {
								_mapSubscribers(key);
							}
						}
					}
				}
			}

			function _mapSubscribers(key) {
				var i;

				for (i = 0; i < subscribers[key].length; i++) {
					if (typeof subscribers[key][i] === 'function') {
						subscribers[key][i]();
					}
				}
			}

			function _clone(target) {
				return JSON.parse(JSON.stringify(target));
			}
		}

		return SpawnCreator;
	})();
})();

module.exports = Spawn;
