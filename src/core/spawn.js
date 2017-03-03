import { INIT_ACTION } from './constants';
import {
  clone,
  mapSubscribers,
  checkCallback,
  findZoneValue,
  plainZoneValue,
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
      prevState = {},
      virtualState = {},
      subscribers = { '*': [] };

  this.select = selector => {
    if (isString(selector)) {
      switch (selector) {
      case '*': return clone(state);
      default: return findZoneValue(selector, state);
      }
    }
    if (isFunc(selector)) return selector(clone(state));

    return error('Spawn: the select method takes only a string or function as argument!');
  }

  this.detect = (zone, cb) => {
    if (!isString(zone)) return error('Spawn: the detect method takes only a string for first argument!');
    if (!isFunc(cb)) return error('Spawn: the detect method takes only a function for second argument!');

    if (!subscribers[zone]) {
      subscribers[zone] = [];
    }

    if (zone === '*' && checkCallback(subscribers[zone], cb)) {
      subscribers[zone].push(cb);
      mapSubscribers(subscribers[zone]);

      return this;
    }

    if (checkCallback(subscribers[zone], cb)) {
      subscribers[zone].push(cb);
    } else {
      return this;
    }

    if (findZoneValue(zone, state)) {
      virtualState = clone(state);
      applyLogic(zone, subscribers, state, prevState, false);
    }

    return this;
  }

  this.update = (zone, action) => {
    if (!isString(zone)) return error(`Spawn: the update method takes only a string for first argument!`);
    if (!isPlainObject(action)) return error(`Spawn: action must be a plain object!`);
    if (!hasKey(action, 'data')) return error(`Spawn: action must have a 'data' key!`);
    if (!hasKey(action, 'type')) return error(`Spawn: action must have a 'type' key!`);
    if (!(isString(action.type))) return error(`Spawn: type of action must be a string!`);

    applyInterceptors(this)(action)(interceptors.concat(update));

    return this;

    function update() {
      return () => action => {
        let zoneParts = zone.split('.'),
            parent = clone(state),
            newState = parent,
            key;

        if (zone === '*') {
          if (isPlainObject(action.data)) {
            state = clone(action.data);
            prevState = {};
            virtualState = {};
            autorun(subscribers);

            return this;
          }

          return error(`Spawn: the update method takes only a plain object for replace full state! Check your update('*') method.`);
        }

        for (let i = 0; i < zoneParts.length; i++) {
          if (!parent.hasOwnProperty(zoneParts[i])) {
            parent[zoneParts[i]] = {};
          }
          if (i === zoneParts.length - 1) {
            parent[zoneParts[i]] = action.data;
            break;
          }
          parent = parent[zoneParts[i]];
        }

        virtualState = clone(newState);

        if (plainZoneValue(zone, state) !== plainZoneValue(zone, virtualState)) {
          state = clone(virtualState);
          applyLogic(zone, subscribers, state, prevState, true);
          prevState = clone(virtualState);
        } else {
          mapSubscribers(subscribers['*']);
        }
      }
    }
  }

  applyInterceptors(this)(INIT_ACTION)(interceptors.concat(store => next => action => next(action)));
}

export {
  Spawn
}
