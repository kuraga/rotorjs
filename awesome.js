import h from 'virtual-dom/h';
import Freezer from 'freezer-js';
import { Kefir } from 'kefir';

var Awesome = function (initialState = {}) {
  var click = Kefir.emitter();
  initialState.streams = {
    click
  };

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
  return h('h1', {
    'kefir-click': state.streams.click
  }, [Awesome.getFullName(state)]);
};

Awesome.clickHandler = function (cursor) {
  cursor.get().set('firstName', 'Vladimir');
  cursor.get().set('lastName', 'Lenin');
};

export default Awesome;
