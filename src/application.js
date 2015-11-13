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
      [rootComponentName]: rootComponent
    };

    this.__cursor = new Freezer(initialState);
    this.rootComponent = this.__cursor.get()[rootComponentName];

    this.render = (currentState) => {
      return this.rootComponent.render();
    };
    this.__updater = (currentState) => {
      this.__loop.update(currentState);
    };

    this.__loop = mainLoop(this.__cursor.get(), this.render, { diff, create, patch });
    this.__cursor.on('update', this.__updater);

    this.rootComponent.activate();
    this.rootElement.appendChild(this.__loop.target);
  }

  stop() {
    this.rootComponent.deactivate();

    this.__cursor.off('update', this.__updater);
  }

  stateUpdatedHandler(currentState) {
    this.__cursor.trigger('update', currentState);
  }

  get __state() {
    return this.__cursor.get();
  }

};
