import tman from 'tman';
import assert from 'assert';
import sinon from 'sinon';
import rafRaf from './helpers/rafRaf.mjs';

import {
  Application,
  Component
} from './helpers/rotorJsClasses.mjs';

import { h } from 'snabbdom';

tman.mocha();

tman.suite('Application', function () {
  let application,
    componentInitialState, component;

  tman.beforeEach(function () {
    application = new Application();
    sinon.spy(application, 'redraw');
    componentInitialState = {
      property: 'value'
    };
    component = new Component(application, null, 'componentName', componentInitialState);
    component.render = function () {
      return h('span');
    };
  });

  tman.afterEach(function () {
    sinon.restore();
  });

  tman.suite('constructor', function () {
    tman.test('should construct an Application instance', function () {
      assert.ok(application instanceof Application);
    });
  });

  tman.suite('.start', function () {
    tman.afterEach(function () {
      application.stop();
    });

    tman.test('should activate root component', function () {
      sinon.spy(component, 'activate');

      application.start(component);

      assert.ok(component.activate.calledOnce);
      assert.ok(component.activate.calledWithExactly());
    });

    tman.test('should render root component', function () {
      sinon.spy(component, 'render');

      application.start(component);

      assert.ok(component.render.calledOnce);
      assert.ok(component.render.calledWithExactly());
      assert.ok(component.render.calledOn(component));
    });
  });

  tman.suite('.stop (called after .start)', function () {
    tman.beforeEach(function () {
      application.start(component);
    });

    tman.test('should deactivate root component', function () {
      sinon.spy(component, 'deactivate');

      application.stop();

      assert.ok(component.deactivate.calledOnce);
      assert.ok(component.deactivate.calledWithExactly());
      assert.ok(component.deactivate.calledOn(component));
    });
  });

  tman.suite('between .start and .stop', function () {
    tman.beforeEach(function () {
      application.start(component);
    });

    tman.afterEach(function () {
      application.stop();
    });

    tman.suite('.rootComponent', function () {
      tman.test('should return root component', function () {
        assert.strictEqual(application.rootComponent, component);
      });
    });

    tman.suite('.target', function () {
      tman.test('should return loop\'s target', function () {
        const applicationLoopTargetObject = {};
        sinon.stub(application.__loop, 'target').value(applicationLoopTargetObject);

        const result = application.target;

        assert.strictEqual(result, applicationLoopTargetObject);
      });
    });

    tman.suite('.redraw', function () {
      tman.test('should call loop\'s .redraw', function () {
        sinon.spy(application.__loop, 'redraw');

        application.redraw();

        assert.ok(application.__loop.redraw.calledOnce);
        assert.ok(application.__loop.redraw.calledWithExactly());
        assert.ok(application.__loop.redraw.calledOn(application.__loop));
      });
    });

    tman.suite('.getComponentState', function () {
      tman.suite('for component', function () {
        tman.test('should contain component state\'s properties', function () {
          const result = application.getComponentState(['componentName']);

          assert.strictEqual(result.property, 'value');
        });
      });

      tman.suite('for subcomponent', function () {
        let subcomponentInitialState, subcomponent;

        tman.beforeEach(function () {
          subcomponentInitialState = {
            secondProperty: 'second value'
          };
          subcomponent = new Component(application, component, 'subcomponentName', subcomponentInitialState);

          component.addSubcomponent(subcomponent);
        });

        tman.afterEach(function () {
          component.removeSubcomponent('subcomponentName');
        });

        tman.test('should contain subcomponent state\'s properties', function () {
          const result = application.getComponentState(['componentName', 'subcomponentName']);

          assert.strictEqual(result.secondProperty, 'second value');
        });
      });

      tman.suite('with wrong path', function () {
        tman.test('should throw an error', function () {
          assert.throws(function () {
            application.getComponentState([]);
          }, /Incorrect component path/);
        });
      });

      tman.suite('updating', function () {
        tman.test('should call .redraw', function (done) {
          const componentState = application.getComponentState(['componentName']);

          application.redraw.resetHistory();
          componentState.set('newProperty', 'new value');

          rafRaf(() => {
            assert.ok(application.redraw.calledOnce);
            assert.ok(application.redraw.calledWithExactly());
            assert.ok(application.redraw.calledOn(application));

            done();
          });
        });
      });
    });
  });
});
