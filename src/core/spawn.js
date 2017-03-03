import { SPAWN_INIT } from './constants';
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
      subscribers = { '*': [] },
      lastAction = { data: {}, type: SPAWN_INIT };

  this.select = selector => {
    if (isString(selector)) {
      switch (selector) {
      case '*': return clone(state);
      case '=>': return clone(lastAction);
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
    if (!hasKey(action, 'data')) return error(`Spawn: action must be has 'data' key!`);
    if (!hasKey(action, 'type')) return error(`Spawn: action must be has 'type' key!`);

    interceptors.push(update);
    applyInterceptors(this)(action)(interceptors);

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
            lastAction = clone(action);
            autorun(subscribers);

            return this;
          }

          return error(`Spawn: the update method takes only a plain object for replace full state! Check your update('*') method.`);
        }

        lastAction = clone(action);

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
}

export {
  Spawn
}
