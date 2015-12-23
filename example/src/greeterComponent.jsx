/** @jsx h */

import { Component } from 'rotorjs';

import ImmutableThunk from 'vnode-immutable-thunk';
import PropertyHook from 'virtual-dom/virtual-hyperscript/hooks/soft-set-hook';
import h from './helpers/virtualDomSpreadH';  // eslint-disable-line no-unused-vars

import TimerComponent from './timerComponent.jsx';

export default class GreeterComponent extends Component {
  constructor(application, parent = null, name = 'greeter', initialState = {}) {
    initialState.status = initialState.status || 'status';

    super(application, parent, name, initialState);
  }

  activate() {
    super.activate();

    let inputHook = new PropertyHook(this.inputHandler.bind(this));
    this.state.set('hooks', {
      input: inputHook
    });

    let timer = new TimerComponent(this.application, this, 'timer');
    this.state.set('timer', timer);
    this.state.timer.activate();
  }

  deactivate() {
    this.state.timer.deactivate();
    this.state.remove('timer');

    super.deactivate();
  }

  get fullName() {
    return `${this.state.firstName} ${this.state.lastName}`;
  }

  render() {
    return <div>
      How have I to address by you?
      <input type="text" oninput={this.state.hooks.input} />
      <br />
      Ok, {this.state.status} {this.fullName}! How are you?
      <br />
      I know your name from URL you entered! You can change it...
      <br />
      <br />
      {ImmutableThunk(() => (
        <span>
          I'm a thunk. I'm changed only if status or name's component has been changed. See: {String(Math.random())}
        </span>
      ), [this.state.status, this.fullName], null, null, true)}
      <br />
      <br />
      {this.state.timer.render()}
    </div>;
  }

  inputHandler(event) {
    this.state.set('status', event.target.value);
  }

}
