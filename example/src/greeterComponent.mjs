/** @jsx snabbdomCreateElement */

import { Component } from './helpers/rotorJsClasses.mjs';

import { thunk as snabbdomThunk } from 'snabbdom';
import { createElement as snabbdomCreateElement } from 'snabbdom-pragma';  // eslint-disable-line no-unused-vars

import TimerComponent from './timerComponent.mjs';

export default class GreeterComponent extends Component {
  constructor(application, parent = null, name = 'greeter', initialState = {}) {
    initialState.status = initialState.status || 'status';
    super(application, parent, name, initialState);

    this.inputHandlerBinded = this.inputHandler.bind(this);
    this.thunkRenderBinded = this.thunkRender.bind(this);
  }

  activate() {
    super.activate();

    const timer = new TimerComponent(this.application, this, 'timer');
    this.addSubcomponent(timer);

    this.getSubcomponent('timer').activate();
  }

  deactivate() {
    this.getSubcomponent('timer').deactivate();

    this.removeSubcomponent('timer');

    super.deactivate();
  }

  get fullName() {
    return `${this.state.firstName} ${this.state.lastName}`;
  }

  thunkRender(status, fullName) {  // eslint-disable-line no-unused-vars
    return <span>
      I'm a thunk. I'm changed only if status or name's component has been changed. See: {String(Math.random())}
    </span>;
  }

  render() {
    return <div>
      How have I to address by you?
      <input type="text" on-input={this.inputHandlerBinded} />
      <br />
      Ok, {this.state.status} {this.fullName}! How are you?
      <br />
      I know your name from URL you entered! You can change it...
      <br />
      <br />
      {snabbdomThunk('span', this.thunkRenderBinded, [this.state.status, this.fullName])}
      <br />
      <br />
      {this.getSubcomponent('timer').render()}
    </div>;
  }

  inputHandler(event) {
    this.state.set('status', event.target.value);
  }

}
