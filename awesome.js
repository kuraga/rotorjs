import h from 'virtual-dom/h';
import Freezer from 'freezer-js';
import { Kefir } from 'kefir';

import Counter from './counter';

export default class Awesome {

  constructor(initialState = {}) {
    var click = Kefir.emitter();
    initialState.streams = {
      click
    };

    initialState.counter = new Counter();

    var cursor = new Freezer(initialState);

    click.onValue( () => {
      Awesome.clickHandler(cursor);
    } );

    return cursor.get();
  };

  static getFullName(state) {
    return `${state.firstName} ${state.lastName}`;
  }

  static render(state) {
    return h('span', null, [
      h('span', [
        h('span', {
          'kefir-click': state.streams.click
        }, [Awesome.getFullName(state)]),
        ' has liked you more than ', Counter.render(state.counter), ' time(s)'
      ])
    ]);
  }

  static clickHandler(cursor) {
    cursor.get().set('firstName', 'Vladimir');
    cursor.get().set('lastName', 'Lenin');
  };

}
