/** @jsx h */

import Component from '../lib/component';
import h from 'virtual-dom/h';
import ImmutableThunk from '../lib/immutable-thunk';
import { Kefir } from 'kefir';
import EmitterHook from '../lib/emitter-hook';
import TimerComponent from './timerComponent';

export default class GreeterComponent extends Component {

  constructor(app, componentPath, initialState = {}) {
    super(app, componentPath, initialState);

    initialState.status = initialState.status || 'status';
    initialState.timer = new TimerComponent(app, this.componentPath.concat('timer'));

    this.input = Kefir.emitter();
    initialState.streams = {
      input: this.input
    };

    return initialState;
  }

  activate() {
    super.activate();

    this.input.onValue(this.inputHandler.bind(this));

    this.state.timer.component.activate();
  }

  deactivate() {
    this.state.timer.component.deactivate();

    this.input.offValue();

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
      {this.state.timer.component.render()}
    </div>;
  }

  inputHandler(event) {
    this.state.set('status', event.target.value);
  }

}
