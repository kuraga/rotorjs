/** @jsx snabbdomCreateElement */

import { Component } from './helpers/rotorJsClasses.mjs';

import { createElement as snabbdomCreateElement } from 'snabbdom-pragma';  // eslint-disable-line no-unused-vars

export default class TimerComponent extends Component {
  constructor(application, parent = null, name = 'timer', initialState = {}) {
    initialState.count = initialState.count || 0;
    initialState.duration = initialState.duration || 1000;

    super(application, parent, name, initialState);

    this.__incCountBinded = this.incCount.bind(this);
  }

  activate() {
    super.activate();

    const intervalId = window.setInterval(this.__incCountBinded, this.state.duration);
    this.state.set('intervalId', intervalId);
  }

  deactivate() {
    window.clearInterval(this.state.intervalId);

    super.deactivate();
  }

  render() {
    return <div style={ { border: 'solid 1px blue', padding: '5px', height: `${this.state.count}px`, overflow: 'hidden' } }>
      I'm a child component. Do you know how long time have I existed for?
      <br />
      I know: for {String(this.state.count)} seconds.
    </div>;
  }

  incCount() {
    this.state.set('count', this.state.count + 1);
  }
}
