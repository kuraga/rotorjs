import tman from 'tman';
import assert from 'assert';
import sinon from 'sinon';
import rafRaf from './helpers/rafRaf';

import {
  Application,
  Component
} from './helpers/rotorJsClasses';

import h from 'virtual-dom/h';

tman.mocha();

let sandbox;

tman.suite('Application', function () {
  let application,
    componentInitialState, component;

  tman.beforeEach(function () {
    sandbox = sinon.sandbox.create();
    application = new Application();
    sandbox.spy(application, 'redraw');
    componentInitialState = {
      property: 'value'
    };
    component = new Component(application, null, 'componentName', componentInitialState);
    component.render = function () {
      return h('span');
    };
  });

  tman.afterEach(function () {
    sandbox.restore();
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
      sandbox.spy(component, 'activate');

      application.start(component);

      assert.ok(component.activate.calledOnce);
      assert.ok(component.activate.calledWithExactly());
    });

    tman.test('should render root component', function () {
      sandbox.spy(component, 'render');

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
      sandbox.spy(component, 'deactivate');

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
        // FIXME: Can't use sandbox here, see https://github.com/sinonjs/sinon/issues/781
        // should assign to a variable here, see https://groups.google.com/forum/#!topic/sinonjs/kRrON0h7riU
        const stub = sinon.stub(application.__loop, 'target', { get: function () { return applicationLoopTargetObject; }});

        const result = application.target;

        assert.ok(stub.get.calledOnce);
        assert.strictEqual(result, applicationLoopTargetObject);  // calls application.target !
      });
    });

    tman.suite('.redraw', function () {
      tman.test('should call loop\'s .redraw', function () {
        // FIXME: Can't use sandbox here, see https://github.com/sinonjs/sinon/issues/781
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

          application.redraw.reset();
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