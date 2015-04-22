/** @jsx h */

import Component from '../lib/component';
import h from 'virtual-dom/h';
import { Kefir } from 'kefir';
import Thunk from 'vdom-thunk';
import EmitterHook from '../lib/emitter-hook';
import TimerComponent from './timerComponent';

export default class GreeterComponent extends Component {

  constructor(app, componentPath, initialState = {}) {
    initialState.status = initialState.status || 'status';

    super(app, componentPath, initialState);

    initialState.timerComponent = new TimerComponent(app, this.componentPath.concat('timerComponent'));

    var input = Kefir.emitter();
    initialState.streams = { input };

    input.onValue(this.inputHandler.bind(this)); // FIXME: somebody have to turn this off

    return initialState;
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
      {Thunk(this.renderThunk.bind(this), this.state.status)}
      <br />
      <br />
      {this.state.timerComponent.component.render()}
    </div>;
  }

  renderThunk() {
    return <span>
      I'm a thunk. I'm changed only if status (now it is "{String(this.state.status)}") has been changed. See: {String(Math.random())}
    </span>;
  }

  inputHandler(event) {
    this.state.set('status', event.target.value);
  }

}
