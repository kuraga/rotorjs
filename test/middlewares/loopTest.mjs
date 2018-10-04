import tman from 'tman';
import assert from 'assert';
import sinon from 'sinon';
import rafRaf from '../helpers/rafRaf';
import clone from 'clone';

import { Loop_VirtualDom as Loop } from '../../middlewares';
import h from 'virtual-dom/h';

tman.mocha();

tman.suite('Loop', function () {
  let loop,
    state, view, viewBinded, viewBindedSpy;

  tman.beforeEach(function () {
    state = {
      property: 'value'
    };
    view = function () {
      return h('div', { class: 'awesome' },
        h('span', null, [ this.property ])
      );
    };
    viewBinded = view.bind(state);
    viewBindedSpy = sinon.spy(viewBinded);

    loop = new Loop(viewBindedSpy);
  });

  tman.afterEach(function () {
    sinon.restore();
  });

  tman.suite('constructor', function () {
    tman.test('should construct an instance of Loop', function () {
      assert.ok(loop instanceof Loop);
    });
  });

  tman.suite('.view', function () {
    tman.test('should return view', function () {
      assert.strictEqual(loop.view, viewBindedSpy);
    });
  });

  tman.suite('.target', function () {
    tman.test('should be defined', function () {
      assert.notStrictEqual(loop.target, undefined);
    });
  });

  tman.suite('.redraw', function () {
    tman.test('should call .view function', function (done) {
      viewBindedSpy.resetHistory();

      loop.redraw();

      rafRaf(() => {
        assert.ok(viewBindedSpy.calledOnce);
        assert.ok(viewBindedSpy.calledWithExactly());
        assert.ok(viewBindedSpy.calledOn(undefined));  // try to check here if not rebound

        done();
      });
    });

    tman.test('should re-render target since state has been changed', function (done) {
      const targetCopy = clone(loop.target);

      state.property = 'new value';
      loop.redraw();

      rafRaf(() => {
        assert.notStrictEqual(loop.target, targetCopy);

        done();
      });
    });

    tman.test('should not re-render target until state has been changed', function (done) {
      const targetCopy = clone(loop.target);

      loop.redraw();

      rafRaf(() => {
        assert.deepEqual(loop.target, targetCopy);

        done();
      });
    });
  });
});
