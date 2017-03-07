function isPlainObject(target) {
  return isObject(target) && !isArray(target) ? true : false;
}

function isObject(target) {
  return typeof target === 'object' && target !== null;
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
  for (let ownKey in target) {
    if (target.hasOwnProperty(ownKey)) {
      if (ownKey === key) return true;
    }
  }

  return false;
}

function error(message) {
  throw new Error(message);
}

export {
  isPlainObject,
  isObject,
  isArray,
  isFunc,
  isString,
  hasKey,
  error
}
