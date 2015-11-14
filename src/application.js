import Freezer from 'freezer-js';
import mainLoop from 'main-loop';
import diff from 'virtual-dom/vtree/diff';
import patch from 'virtual-dom/vdom/patch';
import create from 'virtual-dom/vdom/create-element';

export default class Application {

  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  start(rootComponent) {
    let rootComponentName = rootComponent.name;
    let initialState = {
      rootComponentName,
      [rootComponentName]: rootComponent
    };
    this.__cursor = new Freezer(initialState);

    this.__loop = mainLoop(this.__state, this.render.bind(this), { diff, create, patch });
    this.rootComponent.activate();
    this.rootElement.appendChild(this.__loop.target);
  }

  stop() {
    this.rootComponent.deactivate();
  }

  render(currentState = undefined) {
    return this.rootComponent.render();
  };

  update() {
    this.__loop.update(this.__state);
  }

  get __state() {
    return this.__cursor.get();
  }

  get rootComponent() {
    return this.__state[this.__state.rootComponentName];
  }
};
