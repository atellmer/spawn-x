import { Spawn } from './core';
import {
  isPlainObject,
  isFunc,
  isArray,
  error
} from './helpers';

function createStore(...args) {
  let initialState = {},
      middlewares = [];

  if (args.length === 1) {
     if (isPlainObject(args[0])) {
        initialState = args[0];
        return new Spawn(initialState, middlewares);
     } else {
       if (isArray(args[0])) {
         middlewares = args[0].filter(item => isFunc(item));
         return new Spawn(initialState, middlewares);
       }
       return error('Spawn: createStore with one argument takes only a plain object or applyMidleware function!');
     }
  }
  if (args.length > 1) {
    if (isPlainObject(args[0])) {
        initialState = args[0];
     } else {
       return error('Spawn: createStore with two arguments takes as first argument only a plain object!');
     }
     if (isArray(args[1])) {
        middlewares = args[1].filter(item => isFunc(item));
        return new Spawn(initialState, middlewares);
      }
      return error('Spawn: createStore with two arguments takes as second argument only applyMidleware function!');
  }

  return new Spawn(initialState, middlewares);
}

export {
  createStore
}