import raf from 'raf';
import vDomCreate from 'virtual-dom/vdom/create-element';
import vDomDiff from 'virtual-dom/vtree/diff';
import vDomPatch from 'virtual-dom/vdom/patch';

export default class Loop {
  constructor(view) {
    this.view = view;

    this.__currentTree = (0, this.view)();
    this.target = vDomCreate(this.__currentTree);

    this.__redrawImmediatelyBinded = this.__redrawImmediately.bind(this);
  }

  redraw() {
    raf(this.__redrawImmediatelyBinded);
  }

  __redrawImmediately() {
    let newTree = (0, this.view)();
    let patches = vDomDiff(this.__currentTree, newTree);
    this.target = vDomPatch(this.target, patches);

    this.__currentTree = newTree;
  }
}
