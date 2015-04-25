import Freezer from 'freezer-js';
import mainLoop from 'main-loop';
import diff from 'virtual-dom/vtree/diff';
import patch from 'virtual-dom/vdom/patch';
import create from 'virtual-dom/vdom/create-element';

export default class App {

  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  start(initialComponentState) {
    let initialComponent = initialComponentState.component;
    this.initialComponentName = initialComponent.componentName;
    var initialState = {
      [this.initialComponentName]: initialComponentState
    };
    var render = initialComponent.render.bind(initialComponent);

    this.cursor = new Freezer(initialState);
    this.loop = mainLoop(this.cursor.get(), render, { diff, create, patch });

    this.cursor.on('update', () => {
      this.loop.update();
    });

    this.rootElement.appendChild(this.loop.target);

    this.state[this.initialComponentName].component.activate();
  }

  stop() {
    this.state[this.initialComponentName].component.deactivate();
  }

  get target() {
    return this.loop.target;
  }

  get ownerDocument() {
    return this.target.ownerDocument;
  }

  get state() {
    return this.cursor.get();
  }

};
