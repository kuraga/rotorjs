import objectPath from 'object-path';
import h from 'virtual-dom/h';
import { Kefir } from 'kefir';

import Component from './component';
import Counter from './counter';

export default class Awesome extends Component {

  constructor(app, componentPath, initialState = {}) {
    super(app);

    initialState.counter = new Counter(app, [...componentPath, 'counter']);

    var input = Kefir.emitter();
    initialState.streams = { input };

    input.onValue( (event) => {
      let componentState = objectPath.get(app.cursor.get(), componentPath);
      componentState.set('status', event.target.value);
    } );

    return initialState;
  };

  static getFullName(state) {
    return `${state.firstName} ${state.lastName}`;
  }

  static render(state) {
    return h('span', null, [
      h('span', [
        h('span', null, [Awesome.getFullName(state)]),
        h('input', { type: 'text', 'kefir-input': state.streams.input }),
        h('span', null, [String(state.status)]),
        ' has liked you more than ', Counter.render(state.counter), ' time(s)'
      ])
    ]);
  }

}
