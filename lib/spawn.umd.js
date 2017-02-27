(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Spawn", [], factory);
	else if(typeof exports === 'object')
		exports["Spawn"] = factory();
	else
		root["Spawn"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SPAWN_INIT = '@@SPAWN/INIT';

function clone(target) {
  return JSON.parse(JSON.stringify(target));
}

function mapSubscribers(subscribers) {
  subscribers.forEach(function (item) {
    return item();
  });
}

function checkCallback(subscribers, cb) {
  subscribers.forEach(function (item) {
    if (item === cb) return false;
  });

  return true;
}

function findZoneValue(zone, state) {
  var zoneParts = zone.split('.'),
      parent = clone(state);

  for (var i = 0; i < zoneParts.length; i++) {
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
  for (var key in subscribers) {
    if (subscribers.hasOwnProperty(key)) {
      if (key !== '*') cb(key);
      mapSubscribers(subscribers[key]);
    }
  }
}

function applyLogic(zone, subscribers, state, prevState, afterUpdate) {
  for (var key in subscribers) {
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

exports.SPAWN_INIT = SPAWN_INIT;
exports.clone = clone;
exports.mapSubscribers = mapSubscribers;
exports.checkCallback = checkCallback;
exports.findZoneValue = findZoneValue;
exports.plainZoneValue = plainZoneValue;
exports.autorun = autorun;
exports.applyLogic = applyLogic;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function isPlainObject(target) {
  return isObject(target) && !isArray(target) ? true : false;
}

function isObject(target) {
  return (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object';
}

function isArray(target) {
  return Array.isArray(target);
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

exports.isPlainObject = isPlainObject;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunc = isFunc;
exports.isString = isString;
exports.error = error;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;

var _core = __webpack_require__(0);

var _helpers = __webpack_require__(1);

var Spawn = function Spawn() {
  var state = {},
      prevState = {},
      virtualState = {},
      subscribers = { '*': [] },
      lastZone = _core.SPAWN_INIT;

  if (arguments[0]) {
    if (!(0, _helpers.isPlainObject)(arguments[0])) (0, _helpers.error)('Spawn: the initial state must be plain object!');

    state = arguments[0];
  }

  this.getState = function () {
    return (0, _core.clone)(state);
  };

  this.select = function (selector) {
    if ((0, _helpers.isString)(selector)) {
      switch (selector) {
        case '*':
          return (0, _core.clone)(state);
        case '->':
          return lastZone;
        default:
          return (0, _core.findZoneValue)(selector, state);
      }
    }
    if ((0, _helpers.isFunc)(selector)) return selector((0, _core.clone)(state));

    (0, _helpers.error)('Spawn: the select method takes only a string or function as argument!');
  };

  this.detect = function (zone, callback) {
    if (!(0, _helpers.isString)(zone)) (0, _helpers.error)('Spawn: the detect method takes only a string for first argument!');
    if (!(0, _helpers.isFunc)(callback)) (0, _helpers.error)('Spawn: the detect method takes only a function for second argument!');

    if (!subscribers[zone]) {
      subscribers[zone] = [];
    }

    if (zone === '*' && (0, _core.checkCallback)(subscribers[zone], callback)) {
      subscribers[zone].push(callback);
      (0, _core.mapSubscribers)(subscribers[zone]);

      return this;
    }

    if ((0, _core.checkCallback)(subscribers[zone], callback)) {
      subscribers[zone].push(callback);
    } else {
      return this;
    }

    if ((0, _core.findZoneValue)(zone, state)) {
      virtualState = (0, _core.clone)(state);
      (0, _core.applyLogic)(zone, subscribers, state, prevState, false);
    }

    return this;
  };

  this.update = function (zone, data) {
    if (!(0, _helpers.isString)(zone)) (0, _helpers.error)('Spawn: the update method takes only a string for first argument!');

    var zoneParts = zone.split('.'),
        parent = (0, _core.clone)(state),
        newState = parent,
        key = void 0;

    if (zone === '*') {
      if ((0, _helpers.isPlainObject)(data)) {
        state = (0, _core.clone)(data);
        prevState = {};
        virtualState = {};
        lastZone = zone;
        (0, _core.autorun)(subscribers, function (key) {
          return lastZone = key;
        });

        return this;
      }

      (0, _helpers.error)('Spawn: the update method takes only a plain object for replace full state! Check your update(\'*\') method.');
    }

    lastZone = zone;

    for (var i = 0; i < zoneParts.length; i++) {
      if (!parent.hasOwnProperty(zoneParts[i])) {
        parent[zoneParts[i]] = {};
      }
      if (i === zoneParts.length - 1) {
        parent[zoneParts[i]] = data;
        break;
      }
      parent = parent[zoneParts[i]];
    }

    virtualState = (0, _core.clone)(newState);

    if ((0, _core.plainZoneValue)(zone, state) !== (0, _core.plainZoneValue)(zone, virtualState)) {
      state = (0, _core.clone)(virtualState);
      (0, _core.applyLogic)(zone, subscribers, state, prevState, true);
      prevState = (0, _core.clone)(virtualState);
    } else {
      (0, _core.mapSubscribers)(subscribers['*']);
    }

    return this;
  };
};

function createStore() {
  if (arguments[0]) {
    return new Spawn(arguments[0]);
  }
  return new Spawn();
}

/***/ })
/******/ ]);
});