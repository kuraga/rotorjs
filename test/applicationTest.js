import test from 'tapes';
import sinon from 'sinon';

import {
  Application,
  Component
} from './helpers/rotorJsClasses';

import document from 'global/document';
import h from 'virtual-dom/h';

let sandbox;

test('Application', function (t) {
  let rootNode,
    application,
    component;

  t.beforeEach(function (t) {
    sandbox = sinon.sandbox.create();
    rootNode = document.body;
    application = new Application(rootNode);
    component = new Component(application, null, 'componentName');
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

  t.test('.rootNode', function (t) {
    t.test('should return rootNode', function (t) {
      t.is(application.rootNode, rootNode);

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

    t.skip('should attach target node', function (t) {
      // TODO: check root element's tree

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

    t.skip('should detach target node', function (t) {
      application.stop();

      // TODO: check root element's tree

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

    t.skip('.getComponentState', function (t) {
      t.test('for root component', function (t) {
        t.test('should return root component\'s state', function (t) {
          // TODO: check if result correct

          t.end();
        });

        t.end();
      });

      t.test('for child component', function (t) {
        t.test('should return child component\'s state', function (t) {
          // TODO: check if result correct

          t.end();
        });

        t.end();
      });

      t.test('updating', function (t) {
        t.test('should re-render root component', function (t) {
          // TODO: check render calling

          t.end();
        });

        t.skip('should update target node', function (t) {
          // TODO: check root element's tree

          t.end();
        });

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.end();
});
