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
    let component = initialComponentState.component;
    let componentName = component.componentName;

    var initialState = {
      [componentName]: initialComponentState
    };
    var render = component.render.bind(component);

    this.cursor = new Freezer(initialState);
    this.loop = mainLoop(this.cursor.get(), render, { diff, create, patch });

    this.cursor.on('update', () => {
      this.loop.update();
    });

    this.rootElement.appendChild(this.loop.target);
  }

  get state() {
    return this.cursor.get();
  }

};
