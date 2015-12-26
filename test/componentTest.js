import test from 'tapes';
import sinon from 'sinon';

import {
  Application,
  Component
} from './helpers/rotorJsClasses';

import document from 'global/document';
import h from 'virtual-dom/h';

let sandbox;

test('Component', function (t) {
  let rootNode,
    application,
    rootComponent, name, initialState, component;

  t.beforeEach(function (t) {
    sandbox = sinon.sandbox.create();
    rootNode = document.body;
    application = new Application(rootNode);
    rootComponent = new Component(application, null, 'rootComponentName');
    name = 'componentName';
    initialState = { property: 'value' };
    component = new Component(application, rootComponent, name, initialState);

    t.end();
  });

  t.afterEach(function (t) {
    sandbox.restore();

    t.end();
  });

  t.test('constructor', function (t) {
    t.test('with all arguments', function (t) {
      t.test('should construct a Component instance', function (t) {
        t.assert(component instanceof Component);

        t.end();
      });

      t.end();
    });

    t.test('with required arguments only', function (t) {
      t.test('should construct a Component instance', function (t) {
        let anotherComponent = new Component(application, rootComponent, name);

        t.assert(anotherComponent instanceof Component);

        t.end();
      });

      t.end();
    });

    t.test('with null as parent component', function (t) {
      t.test('should construct a Component instance', function (t) {
        let anotherComponent = new Component(application, null, name);

        t.assert(anotherComponent instanceof Component);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.state', function (t) {
    t.test('should be an Object', function (t) {
      t.assert(component.state instanceof Object);

      t.end();
    });

    t.test('should be copy of initialState\'s properties', function (t) {
      t.not(component.state, initialState);
      t.is(component.state.property, initialState.property);

      t.end();
    });

    t.test('.application', function (t) {
      t.test('should refer to application', function (t) {
        t.is(component.state.application, application);

        t.end();
      });

      t.end();
    });

    t.test('.parent', function (t) {
      t.test('of root component', function (t) {
        t.test('should be null', function (t) {
          let anotherComponent = new Component(application, null, name, initialState);

          t.is(anotherComponent.state.parent, null);

          t.end();
        });

        t.end();
      });

      t.test('of child component', function (t) {
        t.test('should be refer to parent component', function (t) {
          t.is(component.state.parent, rootComponent);

          t.end();
        });

        t.end();
      });

      t.end();
    });

    t.test('.name', function (t) {
      t.test('should be equal to name', function (t) {
        t.is(component.state.name, name);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.application', function (t) {
    t.test('should return application', function (t) {
      t.is(component.application, application);

      t.end();
    });

    t.end();
  });

  t.test('.parent', function (t) {
    t.test('of root component', function (t) {
      t.test('should be null', function (t) {
        let anotherComponent = new Component(application, null, name, initialState);

        t.is(anotherComponent.parent, null);

        t.end();
      });

      t.end();
    });

    t.test('of child component', function (t) {
      t.test('should be refer to parent component', function (t) {
        t.is(component.parent, rootComponent);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.name', function (t) {
    t.test('should return name', function (t) {
      t.is(component.name, name);

      t.end();
    });

    t.end();
  });

  t.test('.path', function (t) {
    t.test('of root component', function (t) {
      t.test('should return array with name', function (t) {
        let anotherComponent = new Component(application, null, name, initialState);

        t.deepEqual(anotherComponent.path, ['componentName']);

        t.end();
      });

      t.end();
    });

    t.test('of child component', function (t) {
      t.test('should return array concatenated with parent\'s path', function (t) {
        t.deepEqual(component.path, ['rootComponentName', 'componentName']);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.render', function (t) {
    t.test('isn\'t implemented', function (t) {
      t.throws(function () {
        component.render();
      }, /Not implemented/);

      t.end();
    });

    t.end();
  });

  t.test('.activate', function (t) {
    t.test('should be declared', function (t) {
      component.activate();

      t.end();
    });

    t.end();
  });

  t.test('.deactivate (called after .activate)', function (t) {
    t.test('should be declared', function (t) {
      component.deactivate();

      t.end();
    });

    t.end();
  });

  t.test('between .activate and .deactivate', function (t) {
    t.beforeEach(function (t) {
      component.render = function () {  // will be called by application.start 
        return h('span');
      };
      application.start(component);  // calls rootComponent.activate

      t.end();
    });

    t.afterEach(function (t) {
      application.stop();  // calls rootComponent.deactivate

      t.end();
    });

    t.test('.update', function (t) {
      t.test('of root component', function (t) {
        t.test('should call application\'s update without arguments', function (t) {
          sandbox.spy(application, 'update');

          let someState = {};
          rootComponent.update(someState);

          t.assert(application.update.calledOnce);
          t.assert(application.update.calledWithExactly());
          t.assert(application.update.calledOn(application));

          t.end();
        });

        t.end();
      });

      t.test('of child component', function (t) {
        t.test('should call parent\'s update without arguments', function (t) {
          sandbox.spy(rootComponent, 'update');

          let someState = {};
          component.update(someState);

          t.assert(rootComponent.update.calledOnce);
          t.assert(rootComponent.update.calledWithExactly());
          t.assert(rootComponent.update.calledOn(rootComponent));

          t.end();
        });

        t.test('should call application\'s update without arguments', function (t) {
          sandbox.spy(application, 'update');

          let someState = {};
          component.update(someState);

          t.assert(application.update.calledOnce);
          t.assert(application.update.calledWithExactly());
          t.assert(application.update.calledOn(application));

          t.end();
        });

        t.end();
      });

      t.end();
    });

    t.test('state updating', function (t) {
      t.test('should call .update', function (t) {
        application.stop();  // calls rootComponent.deactivate
        sandbox.spy(component, 'update');
        component.__updateBinded = component.update.bind(component);
        application.start(component);  // calls rootComponent.activate

        component.state.set('property', 'newValue');

        setTimeout(() => {
          t.assert(component.update.calledOnce);

          t.end();
        }, 20);
      });

      t.end();
    });

    t.end();
  });

  t.end();
});
