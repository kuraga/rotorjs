import objectPath from 'object-path';
import h from 'virtual-dom/h';
import { Kefir } from 'kefir';

import Component from './component';

export default class Counter {

  constructor(app, componentPath, initialState = {}) {
    super(app);

    initialState.count = initialState.count || 0;

    var click = Kefir.emitter();
    click.onValue( () => {
      let componentState = objectPath.get(app.cursor.get(), componentPath);
      Counter.clickHandler(componentState);
    } );
    initialState.streams = { click };

    return initialState;
  }

  static render(state) {
    return h('span', {
      'kefir-click': state.streams.click
    }, [state.count.toString()]);
  }

  static clickHandler(state) {
    state.set('count', state.count+1);
  }

};
