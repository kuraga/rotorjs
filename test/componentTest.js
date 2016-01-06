import test from 'tapes';
import sinon from 'sinon';

import {
  Application,
  Component
} from './helpers/rotorJsClasses';

import h from 'virtual-dom/h';

let sandbox;

test('Component', function (t) {
  let application,
    rootComponent, name, additionalInitialState, component,
    subcomponent, anotherSubcomponent;

  t.beforeEach(function (t) {
    sandbox = sinon.sandbox.create();
    application = new Application();
    application.render = function () {  // avoid renderInvalidRoute
      return h('span');
    };
    application.__renderBinded = application.render.bind(application);
    rootComponent = new Component(application, null, 'rootComponentName');
    name = 'componentName';
    additionalInitialState = { property: 'value' };
    component = new Component(application, rootComponent, name, additionalInitialState);
    subcomponent = new Component(application, rootComponent, 'subcomponentName');
    anotherSubcomponent = new Component(application, rootComponent, 'anotherSubcomponentName');

    application.start(rootComponent);

    t.end();
  });

  t.afterEach(function (t) {
    application.stop();

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

  t.test('.initialState', function (t) {
    t.test('should be an Object', function (t) {
      t.assert(component.initialState instanceof Object);

      t.end();
    });

    t.test('should contain additionalInitialState\'s properties', function (t) {
      t.is(component.initialState.property, additionalInitialState.property);

      t.end();
    });

    t.test('.application', function (t) {
      t.test('should return application', function (t) {
        t.is(component.initialState.application, application);

        t.end();
      });

      t.end();
    });

    t.test('.parent', function (t) {
      t.test('of root component', function (t) {
        t.test('should be null', function (t) {
          let anotherComponent = new Component(application, null, name, additionalInitialState);

          t.is(anotherComponent.initialState.parent, null);

          t.end();
        });

        t.end();
      });

      t.test('of child component', function (t) {
        t.test('should be refer to parent component', function (t) {
          t.is(component.initialState.parent, rootComponent);

          t.end();
        });

        t.end();
      });

      t.end();
    });

    t.test('.name', function (t) {
      t.test('should be equal to name', function (t) {
        t.is(component.initialState.name, name);

        t.end();
      });

      t.end();
    });

    t.test('.component', function (t) {
      t.test('should be equal to name', function (t) {
        t.is(component.initialState.component, component);

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
        let anotherComponent = new Component(application, null, name, additionalInitialState);

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
        let anotherComponent = new Component(application, null, name, additionalInitialState);

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
      component.activate();

      t.end();
    });

    t.afterEach(function (t) {
      component.deactivate();

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

    t.test('.state', function (t) {
      t.beforeEach(function (t) {
        sandbox.stub(application, 'getComponentState');

        t.end();
      });

      t.test('of root component', function (t) {
        let rootComponentStateObject = {};

        t.beforeEach(function (t) {
          application.getComponentState.withArgs(rootComponent.path).returns(rootComponentStateObject);

          t.end();
        });

        t.test('should return root component\'s state', function (t) {
          let result = rootComponent.state;

          t.is(result, rootComponentStateObject);

          t.end();
        });

        t.end();
      });

      t.test('of child component', function (t) {
        let childComponentStateObject;

        t.beforeEach(function (t) {
          childComponentStateObject = {};
          application.getComponentState.withArgs(component.path).returns(childComponentStateObject);

          t.end();
        });

        t.test('should return child component\'s state', function (t) {
          let result = component.state;

          t.is(result, childComponentStateObject);

          t.end();
        });

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.addSubcomponent', function (t) {
    t.test('with non-existant subcomponent', function (t) {
      t.test('should return this', function (t) {
        let result = rootComponent.addSubcomponent(subcomponent);

        t.is(result, rootComponent);

        t.end();
      });

      t.test('should add subcomponent to subcomponents', function (t) {
        rootComponent.addSubcomponent(subcomponent);

        t.is(rootComponent.getSubcomponent('subcomponentName'), subcomponent);
        t.assert(rootComponent.subcomponentNames.indexOf('subcomponentName') !== -1);

        t.end();
      });

      t.end();
    });

    t.test('with existant subcomponent', function (t) {
      t.beforeEach(function (t) {
        rootComponent.addSubcomponent(subcomponent);
        rootComponent.addSubcomponent(anotherSubcomponent);

        t.end();
      });

      t.test('should throw error', function (t) {
        t.throws(function () {
          rootComponent.addSubcomponent(subcomponent);
        }, /Subcomponent 'subcomponentName' already exists/);

        t.end();
      });

      t.test('should not modify existant subcomponent', function (t) {
        t.throws(function () {
          rootComponent.addSubcomponent(subcomponent);
        }, /Subcomponent 'subcomponentName' already exists/);

        t.assert(rootComponent.subcomponentNames.indexOf('subcomponentName') !== -1);
        t.is(rootComponent.getSubcomponent('subcomponentName'), subcomponent);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.removeSubcomponent', function (t) {
    t.test('with existant subcomponent name', function (t) {
      t.beforeEach(function (t) {
        rootComponent.addSubcomponent(subcomponent);
        rootComponent.addSubcomponent(anotherSubcomponent);

        t.end();
      });

      t.test('should return this', function (t) {
        let result = rootComponent.removeSubcomponent('subcomponentName');

        t.is(result, rootComponent);

        t.end();
      });

      t.test('should remove subcomponent', function (t) {
        rootComponent.removeSubcomponent('subcomponentName');

        t.assert(rootComponent.subcomponentNames.indexOf('subcomponentName') === -1);
        t.throws(function () {
          rootComponent.getSubcomponent('subcomponentName');
        }, /Subcomponent 'subcomponentName' doesn't exist/);

        t.end();
      });

      t.test('should not modify other subcomponents', function (t) {
        rootComponent.removeSubcomponent('subcomponentName');

        t.assert(rootComponent.subcomponentNames.indexOf('anotherSubcomponentName') !== -1);
        t.is(rootComponent.getSubcomponent('anotherSubcomponentName'), anotherSubcomponent);

        t.end();
      });

      t.end();
    });

    t.test('with non-existant subcomponent name', function (t) {
      t.test('should throw error', function (t) {
        t.throws(function () {
          rootComponent.removeSubcomponent('wrongSubcomponentName');
        }, /Subcomponent 'wrongSubcomponentName' doesn't exist/);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.getSubcomponentNames', function (t) {
    t.test('should return subcomponent names', function (t) {
      t.deepEquals(rootComponent.subcomponentNames, []);

      t.end();
    });

    // see also .addSubcomponent and .removeSubcomponent tests

    t.end();
  });

  t.test('.getSubcomponent', function (t) {
    // see also .addSubcomponent and .removeSubcomponent tests

    t.end();
  });

  t.end();
});
