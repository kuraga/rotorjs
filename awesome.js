import h from 'virtual-dom/h';
import Freezer from 'freezer-js';
import { Kefir } from 'kefir';

import Counter from './counter';

var Awesome = function (initialState = {}) {
  var click = Kefir.emitter();
  initialState.streams = {
    click
  };

  initialState.counter = Counter();

  var cursor = new Freezer(initialState);

  click.onValue( () => {
    Awesome.clickHandler(cursor);
  } );

  return cursor.get();
};

Awesome.getFullName = function (state) {
  return `${state.firstName} ${state.lastName}`;
};

Awesome.render = function (state) {
  return h('span', null, [
    h('span', [
      h('span', {
        'kefir-click': state.streams.click
      }, [Awesome.getFullName(state)]),
      ' has liked you more than ', Counter.render(state.counter), ' time(s)'
    ])
  ]);
};

Awesome.clickHandler = function (cursor) {
  cursor.get().set('firstName', 'Vladimir');
  cursor.get().set('lastName', 'Lenin');
};

export default Awesome;
