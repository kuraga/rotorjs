/** @jsx h */

import Component from '../lib/component';
import h from 'virtual-dom/h';

export default class TimerComponent extends Component {

  constructor(application, parent = null, name = 'timer', initialState = {}) {
    super(application, parent, name, initialState);

    initialState.count = initialState.count || 0;

    return initialState;
  }

  activate() {
    super.activate();

    this.interval = setInterval(this.incCount.bind(this), 1000);
  }

  deactivate() {
    clearInterval(this.interval);

    super.deactivate();
  }

  render() {
    return <div>
      I'm a child component. Do you know how long time have I existed for?
      <br />
      I know: for {String(this.state.count)} seconds.
    </div>;
  }

  incCount() {
    this.state.set('count', this.state.count + 1);
  }
};
