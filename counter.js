import Component from './component';
import h from 'virtual-dom/h';

export default class Counter extends Component {

  constructor(app, componentPath, initialState = {}) {
    super(app, componentPath, initialState);

    initialState.count = initialState.count || 0;

    setInterval(this.incCount.bind(this), 1000); // FIXME: somebody have to turn this off

    return initialState;
  }

  render() {
    return h('div', null, [
      'I\'m a child component. Do you know how long time have I existed for?',
      h('br'),
      'I know: for ', String(this.state.count), ' seconds.'
    ]);
  }

  incCount() {
    this.state.set('count', this.state.count+1);
  }
};
