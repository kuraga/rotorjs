import objectPath from 'object-path';
import h from 'virtual-dom/h';
import { Kefir } from 'kefir';

import Component from './component';
import Counter from './counter';

export default class Awesome extends Component {

  constructor(app, componentPath, initialState = {}) {
    super(app);

    initialState.counter = new Counter(app, [...componentPath, 'counter']);

    var click = Kefir.emitter();
    click.onValue( () => {
      Awesome.clickHandler(objectPath.get(app.cursor.get(), componentPath));
    } );
    initialState.streams = { click };

    return initialState;
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
    cursor.set('firstName', 'Vladimir');
    cursor.set('lastName', 'Lenin');
  };

}
