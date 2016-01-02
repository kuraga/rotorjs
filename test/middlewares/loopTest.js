import test from 'tapes';
import sinon from 'sinon';
import raf from 'raf';
import clone from 'clone';

import { Loop_VirtualDom as Loop } from '../../middlewares';
import h from 'virtual-dom/h';

let sandbox;

test('Loop', function (t) {
  let loop,
    state, view, viewBinded, viewBindedSpy;

  t.beforeEach(function (t) {
    sandbox = sinon.sandbox.create();
    state = {
      property: 'value'
    };
    view = function () {
      return h('div', { class: 'awesome' },
        h('span', null, [ this.property ])
      );
    };
    viewBinded = view.bind(state);
    viewBindedSpy = sandbox.spy(viewBinded);

    loop = new Loop(viewBindedSpy);

    t.end();
  });

  t.afterEach(function (t) {
    sandbox.restore();

    t.end();
  });

  t.test('constructor', function (t) {
    t.test('should construct an instance of Loop', function (t) {
      t.assert(loop instanceof Loop);

      t.end();
    });

    t.end();
  });

  t.test('.view', function (t) {
    t.test('should return view', function (t) {
      t.is(loop.view, viewBindedSpy);

      t.end();
    });

    t.end();
  });

  t.test('.target', function (t) {
    t.test('should be defined', function (t) {
      t.not(loop.target, undefined);

      t.end();
    });

    t.end();
  });

  t.test('.redraw', function (t) {
    t.test('should call .view function', function (t) {
      viewBindedSpy.reset();

      loop.redraw();

      raf(function () {
        t.assert(viewBindedSpy.calledOnce);
        t.assert(viewBindedSpy.calledWithExactly());
        t.assert(viewBindedSpy.calledOn(undefined));  // try to check here if not rebound

        t.end();
      });
    });

    t.skip('should re-render target since state has been changed', function (t) {
      let targetCopy = clone(loop.target);

      state.property = 'new value';
      loop.redraw();

      raf(function () {
        // TODO: Doesn't work due to circular refernces, see https://github.com/substack/node-deep-equal/issues/19
        t.notDeepEquals(loop.target, targetCopy);

        t.end();
      });
    });

    t.skip('should not re-render target until state has been changed', function (t) {
      let targetCopy = clone(loop.target);

      loop.redraw();

      raf(function () {
        // TODO: Doesn't work due to circular refernces, see https://github.com/substack/node-deep-equal/issues/19
        t.deepEquals(loop.target, targetCopy);

        t.end();
      });
    });

    t.end();
  });

  t.end();
});
