'use strict';

function isPlainObject(target) {
  return isObject(target) && !isArray(target) ? true : false;
}

function isObject(target) {
  return typeof target === 'object';
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

module.exports = {
  isPlainObject,
  isObject,
  isArray,
  isFunc,
  isString,
  error
}
