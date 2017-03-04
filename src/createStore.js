import { Spawn } from './core';
import {
  isPlainObject,
  isFunc,
  isArray,
  error
} from './helpers';

function createStore(...args) {
  let initialState = {},
      interceptors = [];

  if (args.length === 1) {
     if (isPlainObject(args[0])) {
        initialState = args[0];
        return new Spawn(initialState, interceptors);
     } else {
       if (isArray(args[0])) {
         interceptors = args[0].filter(item => isFunc(item));
         return new Spawn(initialState, interceptors);
       }
       return error('spawn-x: createStore with one argument takes only a plain object or addInterceptor function!');
     }
  }
  if (args.length > 1) {
    if (isPlainObject(args[0])) {
        initialState = args[0];
     } else {
       return error('spawn-x: createStore with two arguments takes as first argument only a plain object!');
     }
     if (isArray(args[1])) {
        interceptors = args[1].filter(item => isFunc(item));
        return new Spawn(initialState, interceptors);
      }
      return error('spawn-x: createStore with two arguments takes as second argument only addInterceptor function!');
  }

  return new Spawn(initialState, interceptors);
}

export {
  createStore
}
