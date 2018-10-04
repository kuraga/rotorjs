import Freezer from 'freezer-js';

export default class Cursor_FreezerJs extends Freezer {
  subscribe(callback) {
    return this.on('update', callback);
  }

  unsubscribe(callback) {
    return this.off('update', callback);
  }

  triggerUpdate() {
    return this.emit('update', this.get());
  }
}
