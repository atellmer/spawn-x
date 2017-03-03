import {
  isFunc,
  error
} from './helpers';


function addInterceptor(...args) {
  args.forEach(item => {
    if (!isFunc(item)) return error('Spawn: the addInterceptor takes only a function as arguments!');
  });

  return [...args];
}

export {
  addInterceptor
}
