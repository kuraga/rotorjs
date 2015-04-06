import h from 'virtual-dom/h';
import Freezer from 'freezer-js';
import { Kefir } from 'kefir';

export default class Counter {

  constructor(initialState = {}) {
    initialState.count = initialState.count || 0;

    var click = Kefir.emitter();
    initialState.streams = {
      click
    };

    var cursor = new Freezer(initialState);

    click.onValue( () => {
      Counter.clickHandler(cursor);
    } );

    return cursor.get();
  }

  static render(state) {
    return h('span', {
      'kefir-click': state.streams.click
    }, [state.count.toString()]);
  }

  static clickHandler(cursor) {
    cursor.get().set('count', 1);
  }

};
