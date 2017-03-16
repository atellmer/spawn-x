import { INIT } from './constants';
import {
  getImmutableCopy,
  checkCallback,
  removeCallback,
  findZoneValue,
  autorun,
  applyInterceptors,
  applyLogic
} from './methods';
import {
  isPlainObject,
  isFunc,
  isString,
  hasKey,
  error
} from '../helpers';


const Spawn = function (initialState, interceptors) {
  let state = initialState,
      subscribers = { '*': [] },
      subscribersArgs = { '*': [] };

  this.select = selector => {
    if (isString(selector)) {
      switch (selector) {
      case '*': return getImmutableCopy(state);
      default: return getImmutableCopy(findZoneValue(selector, state));
      }
    }
    if (isFunc(selector)) return getImmutableCopy(selector(getImmutableCopy(state)));

    return error('spawn-x: the select method takes only a string or function as argument!');
  }

  this.detect = (zone, cb, ...args) => {
    if (!isString(zone)) return error('spawn-x: the detect method takes only a string for first argument!');
    if (!isFunc(cb)) return error('spawn-x: the detect method takes only a function for second argument!');

    if (!subscribers[zone] && !subscribersArgs[zone]) {
      subscribers[zone] = [];
      subscribersArgs[zone] = [];
    }

    if (checkCallback(subscribers[zone], cb)) {
      subscribers[zone].push(cb);
      subscribersArgs[zone].push(args);
    } else {
      return this;
    }

    if (findZoneValue(zone, state)) {
      applyLogic({
        zone,
        subscribers,
        subscribersArgs,
        afterUpdate: false 
      });
    }

    return this;
  }

  this.reject = (zone, cb) => {
    if (!isString(zone)) return error('spawn-x: the reject method takes only a string for first argument!');
    if (!isFunc(cb)) return error('spawn-x: the reject method takes only a function for second argument!');

    if (subscribers[zone]) removeCallback({
      subscribers: subscribers[zone],
      subscribersArgs: subscribersArgs[zone],
      cb
    });

    return this;
  }

  this.update = (zone, action) => {
    if (!isString(zone)) return error(`spawn-x: the update method takes only a string for first argument!`);
    if (!isPlainObject(action)) return error(`spawn-x: action must be a plain object!`);
    if (!hasKey(action, 'data')) return error(`spawn-x: action must have a 'data' key!`);
    if (!hasKey(action, 'type')) return error(`spawn-x: action must have a 'type' key!`);
    if (!(isString(action.type))) return error(`spawn-x: type of action must be a string!`);

    applyInterceptors(this)(action)(interceptors.concat(update));

    return this;

    function update() {
      return () => action => {
        let zoneParts = zone.split('.'),
            newState = state;

        if (zone === '*') {
          if (isPlainObject(action.data)) {
            state = getImmutableCopy(action.data);
            autorun(subscribers, subscribersArgs);

            return this;
          }

          return error(`spawn-x: the update method takes only a plain object for replace full state! Check your update('*') method.`);
        }

        for (let i = 0; i < zoneParts.length; i++) {
          if (!newState.hasOwnProperty(zoneParts[i])) {
            newState[zoneParts[i]] = {};
          }
          if (i === zoneParts.length - 1) {
            newState[zoneParts[i]] = action.data;
          } else {
            newState = newState[zoneParts[i]];
          }
        }

        applyLogic({
          action: getImmutableCopy(action),
          zone,
          subscribers,
          subscribersArgs,
          afterUpdate: true 
        });
      }
    }
  }

  applyInterceptors(this)(INIT)(interceptors.concat(store => next => action => next(action)));
}

export {
  Spawn
}
