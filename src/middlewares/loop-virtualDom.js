import raf from 'raf';
import vDomCreate from 'virtual-dom/vdom/create-element';
import vDomDiff from 'virtual-dom/vtree/diff';
import vDomPatch from 'virtual-dom/vdom/patch';

export default class Loop_VirtualDom {
  constructor(view) {
    this.__view = view;

    this.__redrawImmediatelyBinded = this.__redrawImmediately.bind(this);

    this.__currentTree = (0, this.__view)();
    this.__target = vDomCreate(this.__currentTree);
  }

  get view() {
    return this.__view;
  }

  get target() {
    return this.__target;
  }

  redraw() {
    raf(this.__redrawImmediatelyBinded);
  }

  __redrawImmediately() {
    let newTree = (0, this.view)();
    let patches = vDomDiff(this.__currentTree, newTree);
    this.__target = vDomPatch(this.__target, patches);

    this.__currentTree = newTree;
  }
}
