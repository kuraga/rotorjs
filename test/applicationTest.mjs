import test from 'tapes';
import sinon from 'sinon';
import rafRaf from './helpers/rafRaf';

import {
  Application,
  Component
} from './helpers/rotorJsClasses';

import h from 'virtual-dom/h';

let sandbox;

test('Application', function (t) {
  let application,
    componentInitialState, component;

  t.beforeEach(function (t) {
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

    t.end();
  });

  t.afterEach(function (t) {
    sandbox.restore();

    t.end();
  });

  t.test('constructor', function (t) {
    t.test('should construct an Application instance', function (t) {
      t.assert(application instanceof Application);

      t.end();
    });

    t.end();
  });

  t.test('.start', function (t) {
    t.afterEach(function (t) {
      application.stop();

      t.end();
    });

    t.test('should activate root component', function (t) {
      sandbox.spy(component, 'activate');

      application.start(component);

      t.assert(component.activate.calledOnce);
      t.assert(component.activate.calledWithExactly());

      t.end();
    });

    t.test('should render root component', function (t) {
      sandbox.spy(component, 'render');

      application.start(component);

      t.assert(component.render.calledOnce);
      t.assert(component.render.calledWithExactly());
      t.assert(component.render.calledOn(component));

      t.end();
    });

    t.end();
  });

  t.test('.stop (called after .start)', function (t) {
    t.beforeEach(function (t) {
      application.start(component);

      t.end();
    });

    t.test('should deactivate root component', function (t) {
      sandbox.spy(component, 'deactivate');

      application.stop();

      t.assert(component.deactivate.calledOnce);
      t.assert(component.deactivate.calledWithExactly());
      t.assert(component.deactivate.calledOn(component));

      t.end();
    });

    t.end();
  });

  t.test('between .start and .stop', function (t) {
    t.beforeEach(function (t) {
      application.start(component);

      t.end();
    });

    t.afterEach(function (t) {
      application.stop();

      t.end();
    });

    t.test('.rootComponent', function (t) {
      t.test('should return root component', function (t) {
        t.is(application.rootComponent, component);

        t.end();
      });

      t.end();
    });

    t.test('.target', function (t) {
      t.test('should return loop\'s target', function (t) {
        const applicationLoopTargetObject = {};
        // FIXME: Can't use sandbox here, see https://github.com/sinonjs/sinon/issues/781
        // should assign to a variable here, see https://groups.google.com/forum/#!topic/sinonjs/kRrON0h7riU
        const stub = sinon.stub(application.__loop, 'target', { get: function () { return applicationLoopTargetObject; }});

        const result = application.target;

        t.assert(stub.get.calledOnce);
        t.is(result, applicationLoopTargetObject);  // calls application.target !

        t.end();
      });

      t.end();
    });

    t.test('.redraw', function (t) {
      t.test('should call loop\'s .redraw', function (t) {
        // FIXME: Can't use sandbox here, see https://github.com/sinonjs/sinon/issues/781
        sinon.spy(application.__loop, 'redraw');

        application.redraw();

        t.assert(application.__loop.redraw.calledOnce);
        t.assert(application.__loop.redraw.calledWithExactly());
        t.assert(application.__loop.redraw.calledOn(application.__loop));

        t.end();
      });

      t.end();
    });

    t.test('.getComponentState', function (t) {
      t.test('for component', function (t) {
        t.test('should contain component state\'s properties', function (t) {
          const result = application.getComponentState(['componentName']);

          t.is(result.property, 'value');

          t.end();
        });

        t.end();
      });

      t.test('for subcomponent', function (t) {
        let subcomponentInitialState, subcomponent;

        t.beforeEach(function (t) {
          subcomponentInitialState = {
            secondProperty: 'second value'
          };
          subcomponent = new Component(application, component, 'subcomponentName', subcomponentInitialState);

          component.addSubcomponent(subcomponent);

          t.end();
        });

        t.afterEach(function (t) {
          component.removeSubcomponent('subcomponentName');

          t.end();
        });

        t.test('should contain subcomponent state\'s properties', function (t) {
          const result = application.getComponentState(['componentName', 'subcomponentName']);

          t.is(result.secondProperty, 'second value');

          t.end();
        });

        t.end();
      });

      t.test('with wrong path', function (t) {
        t.test('should throw an error', function (t) {
          t.throws(function () {
            application.getComponentState([]);
          }, /Incorrect component path/);

          t.end();
        });

        t.end();
      });

      t.test('updating', function (t) {
        t.test('should call .redraw', function (t) {
          const componentState = application.getComponentState(['componentName']);

          application.redraw.reset();
          componentState.set('newProperty', 'new value');

          rafRaf(() => {
            t.assert(application.redraw.calledOnce);
            t.assert(application.redraw.calledWithExactly());
            t.assert(application.redraw.calledOn(application));

            t.end();
          });
        });

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.end();
});
