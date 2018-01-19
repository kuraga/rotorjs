import Freezer from 'freezer-js';

export default class Cursor_FreezerJs {
  constructor(object) {
    this.__freezer = new Freezer(object);
  }

  get() {
    return this.__freezer.get();
  }

  set(...args) {
    if (args.length === 1) {
      return this.__freezer.set(args[0]);
    } else {
      return this.__freezer.set(...args);
    }
  }

  remove(...args) {
    if (args.length === 1) {
      return this.__freezer.remove(args[0]);
    } else {
      return this.__freezer.remove(...args);
    }
  }

  subscribe(callback) {
    return this.__freezer.on('update', callback);
  }

  unsubscribe(callback) {
    return this.__freezer.off('update', callback);
  }

  trigger() {
    return this.__freezer.trigger('update', this.__freezer.get());
  }
}
