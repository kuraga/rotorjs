import mainLoop from 'main-loop';
import vDomCreate from 'virtual-dom/vdom/create-element';
import vDomDiff from 'virtual-dom/vtree/diff';
import vDomPatch from 'virtual-dom/vdom/patch';

export default class Loop {

  constructor(initialState, render) {
    this.__mainLoop = mainLoop(initialState, render, { create: vDomCreate, diff: vDomDiff, patch: vDomPatch });
  }

  update(currentState) {
    this.__mainLoop.update(currentState);
  }

  get target() {
    return this.__mainLoop.target;
  }
}
