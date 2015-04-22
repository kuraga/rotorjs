import Component from '../lib/component';
import h from 'virtual-dom/h';

export default class MainComponent extends Component {

  constructor(app, componentPath) {
    var initialState = {};
    super(app, componentPath, initialState);

    return initialState;
  }

  render() {
    return h('div', null, [
      'Hello! ',
      h('a', { href: '#/greeter/FirstName/LastName' }, ['Click here']),
      h('br'),
      'Or try to visit an invalid ',
      h('a', { href: '#/invalid' }, ['link'])
    ]);
  }

}
