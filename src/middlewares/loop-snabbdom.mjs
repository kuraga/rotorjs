import raf from 'raf';
import { init as snabbdomInit } from 'snabbdom';
import snabbdomPropsModule from 'snabbdom/es/modules/props';
import snabbdomEventListenersModule from 'snabbdom/es/modules/eventlisteners';
import snabbdomClassModule from 'snabbdom/es/modules/class';
import snabbdomStyleModule from 'snabbdom/es/modules/style';

export default class Loop_Snabbdom {
  // TODO: Add `window` argument
  constructor(view) {
    this.__view = view;

    this.__document = document;
    this.__target = this.__document.createElement('div');
    this.__vdom = null;

    // TODO: Make list of modules tunable
    this.__patch = snabbdomInit([
      snabbdomPropsModule,
      snabbdomEventListenersModule,
      snabbdomClassModule,
      snabbdomStyleModule
    ]);
    this.__redrawImmediatelyBinded = this.__redrawImmediately.bind(this);

    this.__redrawImmediatelyBinded();
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
    const newTree = (0, this.view)();
    if (this.__vdom === null) {
      this.__vdom = this.__patch(this.__target, newTree);
    } else {
      this.__vdom = this.__patch(this.__vdom, newTree);
    }
  }

  // TODO: Add `.window` property
  // TODO: Add `.start` and `.stop` methods
  // TODO: Add `.onNextTick` method
}
