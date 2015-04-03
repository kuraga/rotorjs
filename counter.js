import h from 'virtual-dom/h';
import Freezer from 'freezer-js';
import { Kefir } from 'kefir';

var Counter = function (initialState = {}) {
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
};

Counter.render = function (state) {
  return h('span', {
    'kefir-click': state.streams.click
  }, [state.count.toString()]);
};

Counter.clickHandler = function (cursor) {
  cursor.get().set('count', 1);
};

export default Counter;
