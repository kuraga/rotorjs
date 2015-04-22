/** @jsx h */

import Component from '../lib/component';
import h from 'virtual-dom/h';

export default class TimerComponent extends Component {

  constructor(app, componentPath, initialState = {}) {
    initialState.count = initialState.count || 0;

    super(app, componentPath, initialState);

    setInterval(this.incCount.bind(this), 1000); // FIXME: somebody have to turn this off

    return initialState;
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
