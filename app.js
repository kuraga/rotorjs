import Freezer from 'freezer-js';
import mainLoop from 'main-loop';
import diff from 'virtual-dom/vtree/diff';
import patch from 'virtual-dom/vdom/patch';
import create from 'virtual-dom/vdom/create-element';

export default function App(element, initialState, render) {
  var cursor = new Freezer(initialState);
  var loop = mainLoop(cursor.get(), render, { diff, create, patch });

  cursor.on('update', () => {
    loop.update(cursor.get());
  });

  element.appendChild(loop.target);
}
