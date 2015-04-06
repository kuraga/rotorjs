import Freezer from 'freezer-js';
import mainLoop from 'main-loop';
import diff from 'virtual-dom/vtree/diff';
import patch from 'virtual-dom/vdom/patch';
import create from 'virtual-dom/vdom/create-element';

export default class App {

  constructor(rootElement, initialState, render) {
    this.rootElement = rootElement;

    this.cursor = new Freezer(initialState);
    this.loop = mainLoop(this.cursor.get(), render, { diff, create, patch });

    this.cursor.on('update', () => {
      this.loop.update(this.cursor.get());
    });

    this.rootElement.appendChild(this.loop.target);
  }

};
