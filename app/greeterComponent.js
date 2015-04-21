import Component from '../lib/component';
import h from 'virtual-dom/h';
import { Kefir } from 'kefir';
import Thunk from 'vdom-thunk';
import EmitterHook from '../lib/emitter-hook';
import TimerComponent from './timerComponent';

export default class GreeterComponent extends Component {

  constructor(app, componentPath, initialState = {}) {
    super(app, componentPath, initialState);

    initialState.timerComponent = new TimerComponent(app, [...this.componentPath, 'timerComponent']);

    var input = Kefir.emitter();
    initialState.streams = { input };

    input.onValue(this.inputHandler.bind(this)); // FIXME: somebody have to turn this off

    return initialState;
  }

  get fullName() {
    return `${this.state.firstName} ${this.state.lastName}`;
  }

  render() {
    return h('div', null, [
      'How have I to address by you? ',
      h('input', { type: 'text', 'kefir-input': new EmitterHook(this.state.streams.input) }),
      h('br'),
      `Ok, ${this.state.status} ${this.fullName}! How are you?`,
      h('br'),
      h('br'),
      Thunk(this.renderThunk.bind(this), this.state.status),
      h('br'),
      h('br'),
      this.state.timerComponent.component.render()
    ]);
  }

  renderThunk() {
    return h('span', null, [
      `I'm a thunk. I'm changed only if status (now it is "${this.state.status}") has been changed. See: ${Math.random()}`
    ]);
  }

  inputHandler(event) {
    this.state.set('status', event.target.value);
  }

}
