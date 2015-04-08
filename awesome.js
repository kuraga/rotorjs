import Component from './component';
import h from 'virtual-dom/h';
import { Kefir } from 'kefir';
import Counter from './counter';

export default class Awesome extends Component {

  constructor(app, componentPath, initialState = {}) {
    super(app, componentPath, initialState);

    initialState.counter = new Counter(app, [...this.componentPath, 'counter']);

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
      h('input', { type: 'text', 'kefir-input': this.state.streams.input }),
      h('br'),
      'Ok, ', String(this.state.status), ' ', this.fullName, '. How are you?',
      h('br'),
      this.state.counter.component.render()
    ]);
  }

  inputHandler(event) {
    this.state.set('status', event.target.value);
  }

}
