import Component from '../lib/component';
import h from 'virtual-dom/h';
import { Kefir } from 'kefir';
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
      'Ok, ', String(this.state.status), ' ', this.fullName, '. How are you?',
      h('br'),
      this.state.timerComponent.component.render()
    ]);
  }

  inputHandler(event) {
    this.state.set('status', event.target.value);
  }

}
