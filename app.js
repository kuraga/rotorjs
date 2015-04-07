import Freezer from 'freezer-js';
import mainLoop from 'main-loop';
import diff from 'virtual-dom/vtree/diff';
import patch from 'virtual-dom/vdom/patch';
import create from 'virtual-dom/vdom/create-element';

export default class App {

  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  plug(initialState, render) {
    this.cursor = new Freezer(initialState);
    this.loop = mainLoop(this.cursor.get(), render, { diff, create, patch });

    this.cursor.on('update', (data) => {
      this.loop.update(data);
    });

    this.rootElement.appendChild(this.loop.target);
  }

};
