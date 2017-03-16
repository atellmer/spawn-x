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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports.hasKey = exports.isString = exports.isFunc = exports.isArray = exports.isObject = exports.isPlainObject = undefined;

var _helpers = __webpack_require__(7);

exports.isPlainObject = _helpers.isPlainObject;
exports.isObject = _helpers.isObject;
exports.isArray = _helpers.isArray;
exports.isFunc = _helpers.isFunc;
exports.isString = _helpers.isString;
exports.hasKey = _helpers.hasKey;
exports.error = _helpers.error;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addInterceptor = undefined;

var _helpers = __webpack_require__(0);

function addInterceptor() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  args.forEach(function (item) {
    if (!(0, _helpers.isFunc)(item)) return (0, _helpers.error)('spawn-x: the addInterceptor takes only a function as arguments!');
  });

  return [].concat(args);
}

exports.addInterceptor = addInterceptor;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = undefined;

var _core = __webpack_require__(4);

var _helpers = __webpack_require__(0);

function createStore() {
  var initialState = {},
      interceptors = [];

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) {
    if ((0, _helpers.isPlainObject)(args[0])) {
      initialState = args[0];
      return new _core.Spawn(initialState, interceptors);
    } else {
      if ((0, _helpers.isArray)(args[0])) {
        interceptors = args[0].filter(function (item) {
          return (0, _helpers.isFunc)(item);
        });
        return new _core.Spawn(initialState, interceptors);
      }
      return (0, _helpers.error)('spawn-x: createStore with one argument takes only a plain object or addInterceptor function!');
    }
  }
  if (args.length > 1) {
    if ((0, _helpers.isPlainObject)(args[0])) {
      initialState = args[0];
    } else {
      return (0, _helpers.error)('spawn-x: createStore with two arguments takes as first argument only a plain object!');
    }
    if ((0, _helpers.isArray)(args[1])) {
      interceptors = args[1].filter(function (item) {
        return (0, _helpers.isFunc)(item);
      });
      return new _core.Spawn(initialState, interceptors);
    }
    return (0, _helpers.error)('spawn-x: createStore with two arguments takes as second argument only addInterceptor function!');
  }

  return new _core.Spawn(initialState, interceptors);
}

exports.createStore = createStore;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var INIT = exports.INIT = { data: {}, type: '@@SPAWN/INIT' };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spawn = undefined;

var _spawn = __webpack_require__(6);

exports.Spawn = _spawn.Spawn;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyLogic = exports.applyInterceptors = exports.compose = exports.autorun = exports.findZoneValue = exports.removeCallback = exports.checkCallback = exports.mapSubscribers = exports.getImmutableCopy = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _helpers = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getImmutableCopy(target) {
  if ((0, _helpers.isPlainObject)(target)) return _extends({}, target);
  if ((0, _helpers.isArray)(target)) return [].concat(_toConsumableArray(target));

  return target;
}

function mapSubscribers(_ref) {
  var subscribers = _ref.subscribers,
      subscribersArgs = _ref.subscribersArgs,
      action = _ref.action;

  subscribers.forEach(function (cb, index) {
    return cb.apply(undefined, _toConsumableArray(subscribersArgs[index]).concat([action]));
  });
}

function checkCallback(subscribers, cb) {
  subscribers.forEach(function (item) {
    if (item === cb) return false;
  });

  return true;
}

function removeCallback(_ref2) {
  var subscribers = _ref2.subscribers,
      subscribersArgs = _ref2.subscribersArgs,
      cb = _ref2.cb;

  subscribers.forEach(function (item, index) {
    if (item === cb) {
      subscribers.splice(index, 1);
      subscribersArgs.splice(index, 1);

      return true;
    }
  });

  return false;
}

function findZoneValue(zone, state) {
  var zoneParts = zone.split('.'),
      parent = state;

  for (var i = 0; i < zoneParts.length; i++) {
    if (!parent.hasOwnProperty(zoneParts[i])) {
      return null;
    }
    parent = parent[zoneParts[i]];
  }

  return parent;
}

function autorun(subscribers, subscribersArgs) {
  Object.keys(subscribers).forEach(function (key) {
    return mapSubscribers({
      subscribers: subscribers[key],
      subscribersArgs: subscribersArgs[key]
    });
  });
}

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) return function (arg) {
    return arg;
  };
  if (funcs.length === 1) return funcs[0];

  return funcs.reduce(function (fn1, fn2) {
    return function () {
      return fn1(fn2.apply(undefined, arguments));
    };
  });
}

function applyInterceptors(store) {
  return function (action) {
    return function (interceptors) {
      return compose.apply(undefined, _toConsumableArray(interceptors.map(function (fn) {
        return fn(store);
      })))(function (arg) {
        return arg;
      })(action);
    };
  };
}

function applyLogic(_ref3) {
  var action = _ref3.action,
      zone = _ref3.zone,
      subscribers = _ref3.subscribers,
      subscribersArgs = _ref3.subscribersArgs,
      afterUpdate = _ref3.afterUpdate;

  var keys = Object.keys(subscribers).filter(function (key) {
    return key !== '*';
  });
  var zoneParts = zone.split('.');

  keys.forEach(function (key) {
    var keyParts = key.split('.');

    if (key === zone) {
      mapSubscribers({
        subscribers: subscribers[key],
        subscribersArgs: subscribersArgs[key]
      });
      return;
    }

    if (keyParts.length <= zoneParts.length) {
      var check = true;

      keyParts.forEach(function (keyPart, index) {
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
      var _check = true;

      zoneParts.forEach(function (zonePart, index) {
        if (zonePart !== keyParts[index]) {
          _check = false;
          return;
        }
      });

      if (_check) {
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
      action: action
    });
  }
}

exports.getImmutableCopy = getImmutableCopy;
exports.mapSubscribers = mapSubscribers;
exports.checkCallback = checkCallback;
exports.removeCallback = removeCallback;
exports.findZoneValue = findZoneValue;
exports.autorun = autorun;
exports.compose = compose;
exports.applyInterceptors = applyInterceptors;
exports.applyLogic = applyLogic;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Spawn = undefined;

var _constants = __webpack_require__(3);

var _methods = __webpack_require__(5);

var _helpers = __webpack_require__(0);

var Spawn = function Spawn(initialState, interceptors) {
  var _this = this;

  var state = initialState,
      subscribers = { '*': [] },
      subscribersArgs = { '*': [] };

  this.select = function (selector) {
    if ((0, _helpers.isString)(selector)) {
      switch (selector) {
        case '*':
          return (0, _methods.getImmutableCopy)(state);
        default:
          return (0, _methods.getImmutableCopy)((0, _methods.findZoneValue)(selector, state));
      }
    }
    if ((0, _helpers.isFunc)(selector)) return (0, _methods.getImmutableCopy)(selector((0, _methods.getImmutableCopy)(state)));

    return (0, _helpers.error)('spawn-x: the select method takes only a string or function as argument!');
  };

  this.detect = function (zone, cb) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    if (!(0, _helpers.isString)(zone)) return (0, _helpers.error)('spawn-x: the detect method takes only a string for first argument!');
    if (!(0, _helpers.isFunc)(cb)) return (0, _helpers.error)('spawn-x: the detect method takes only a function for second argument!');

    if (!subscribers[zone] && !subscribersArgs[zone]) {
      subscribers[zone] = [];
      subscribersArgs[zone] = [];
    }

    if ((0, _methods.checkCallback)(subscribers[zone], cb)) {
      subscribers[zone].push(cb);
      subscribersArgs[zone].push(args);
    } else {
      return _this;
    }

    if ((0, _methods.findZoneValue)(zone, state)) {
      (0, _methods.applyLogic)({
        zone: zone,
        subscribers: subscribers,
        subscribersArgs: subscribersArgs,
        afterUpdate: false
      });
    }

    return _this;
  };

  this.reject = function (zone, cb) {
    if (!(0, _helpers.isString)(zone)) return (0, _helpers.error)('spawn-x: the reject method takes only a string for first argument!');
    if (!(0, _helpers.isFunc)(cb)) return (0, _helpers.error)('spawn-x: the reject method takes only a function for second argument!');

    if (subscribers[zone]) (0, _methods.removeCallback)({
      subscribers: subscribers[zone],
      subscribersArgs: subscribersArgs[zone],
      cb: cb
    });

    return _this;
  };

  this.update = function (zone, action) {
    if (!(0, _helpers.isString)(zone)) return (0, _helpers.error)('spawn-x: the update method takes only a string for first argument!');
    if (!(0, _helpers.isPlainObject)(action)) return (0, _helpers.error)('spawn-x: action must be a plain object!');
    if (!(0, _helpers.hasKey)(action, 'data')) return (0, _helpers.error)('spawn-x: action must have a \'data\' key!');
    if (!(0, _helpers.hasKey)(action, 'type')) return (0, _helpers.error)('spawn-x: action must have a \'type\' key!');
    if (!(0, _helpers.isString)(action.type)) return (0, _helpers.error)('spawn-x: type of action must be a string!');

    (0, _methods.applyInterceptors)(_this)(action)(interceptors.concat(update));

    return _this;

    function update() {
      var _this2 = this;

      return function () {
        return function (action) {
          var zoneParts = zone.split('.'),
              newState = state;

          if (zone === '*') {
            if ((0, _helpers.isPlainObject)(action.data)) {
              state = (0, _methods.getImmutableCopy)(action.data);
              (0, _methods.autorun)(subscribers, subscribersArgs);

              return _this2;
            }

            return (0, _helpers.error)('spawn-x: the update method takes only a plain object for replace full state! Check your update(\'*\') method.');
          }

          for (var i = 0; i < zoneParts.length; i++) {
            if (!newState.hasOwnProperty(zoneParts[i])) {
              newState[zoneParts[i]] = {};
            }
            if (i === zoneParts.length - 1) {
              newState[zoneParts[i]] = action.data;
            } else {
              newState = newState[zoneParts[i]];
            }
          }

          (0, _methods.applyLogic)({
            action: (0, _methods.getImmutableCopy)(action),
            zone: zone,
            subscribers: subscribers,
            subscribersArgs: subscribersArgs,
            afterUpdate: true
          });
        };
      };
    }
  };

  (0, _methods.applyInterceptors)(this)(_constants.INIT)(interceptors.concat(function (store) {
    return function (next) {
      return function (action) {
        return next(action);
      };
    };
  }));
};

exports.Spawn = Spawn;

/***/ }),
/* 7 */
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
  return (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target !== null;
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

function hasKey(target, key) {
  for (var ownKey in target) {
    if (target.hasOwnProperty(ownKey)) {
      if (ownKey === key) return true;
    }
  }

  return false;
}

function error(message) {
  throw new Error(message);
}

exports.isPlainObject = isPlainObject;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunc = isFunc;
exports.isString = isString;
exports.hasKey = hasKey;
exports.error = error;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addInterceptor = exports.createStore = undefined;

var _createStore = __webpack_require__(2);

var _addInterceptor = __webpack_require__(1);

exports.createStore = _createStore.createStore;
exports.addInterceptor = _addInterceptor.addInterceptor;

/***/ })
/******/ ]);
});