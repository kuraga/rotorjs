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

    this.cursor = new Freezer(initialState);
    this.rootComponent = this.cursor.get()[rootComponentName];

    this.render = (currentState) => {
      return this.rootComponent.render();
    };
    this.updater = (currentState) => {
      this.loop.update(currentState);
    };

    this.loop = mainLoop(this.cursor.get(), this.render, { diff, create, patch });
    this.cursor.on('update', this.updater);

    this.rootComponent.activate();
    this.rootElement.appendChild(this.loop.target);
  }

  stop() {
    this.rootComponent.deactivate();

    this.cursor.off('update', this.updater);
  }

  stateUpdatedHandler(currentState) {
    this.cursor.trigger('update', currentState);
  }

  get state() {
    return this.cursor.get();
  }

};
