/** @jsx h */

import Component from '../lib/component';
import h from 'virtual-dom/h';
import ImmutableThunk from '../lib/immutable-thunk';
import { Kefir } from 'kefir';
import EmitterHook from '../lib/emitter-hook';
import TimerComponent from './timerComponent';

export default class GreeterComponent extends Component {

  constructor(application, parent = null, name = 'greeter', initialState = {}) {
    initialState.status = initialState.status || 'status';

    let input = Kefir.emitter();
    initialState.streams = {
      input
    };

    super(application, parent, name, initialState);
  }

  activate() {
    super.activate();

    this.state.streams.input.onValue(this.inputHandler.bind(this));

    let timer = new TimerComponent(this.application, this, 'timer');
    this.state.set('timer', timer);
    this.state.timer.activate();
  }

  deactivate() {
    this.state.timer.deactivate();

    this.state.streams.input.offValue();

    super.deactivate();
  }

  get fullName() {
    return `${this.state.firstName} ${this.state.lastName}`;
  }

  render() {
    return <div>
      How have I to address by you?
      <input type="text" kefir-input={new EmitterHook(this.state.streams.input)} />
      <br />
      Ok, {this.state.status} {this.fullName}! How are you?
      <br />
      <br />
      {new ImmutableThunk(() => (
        <span>
          I'm a thunk. I'm changed only if status or name's component has been changed. See: {String(Math.random())}
        </span>
      ), [this.state.status, this.fullName])}
      <br />
      <br />
      {this.state.timer.render()}
    </div>;
  }

  inputHandler(event) {
    this.state.set('status', event.target.value);
  }

}
