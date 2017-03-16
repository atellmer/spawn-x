import {
  isFunc,
  error
} from './helpers';


function addInterceptor(...args) {
  args.forEach(item => {
    if (!isFunc(item)) return error('spawn-x: the addInterceptor takes only a function as arguments!');
  });

  return [...args];
}

export {
  addInterceptor
}
