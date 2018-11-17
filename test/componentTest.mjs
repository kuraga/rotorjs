import tman from 'tman';
import assert from 'assert';
import sinon from 'sinon';

import {
  Application,
  Component
} from './helpers/rotorJsClasses';

import h from 'snabbdom/h';

function patchApplication(application) {
  // WARNING: Avoid renderInvalidRoute at application start
  application.render = function () {
    return h('span');
  };
  application.__renderBinded = application.render.bind(application);
}

tman.mocha();

tman.suite('Component', function () {
  let application,
    rootComponent, name, additionalInitialState, component,
    subcomponent, anotherSubcomponent;

  tman.beforeEach(function () {
    application = new Application();
    patchApplication(application);

    rootComponent = new Component(application, null, 'rootComponentName');

    name = 'componentName';
    additionalInitialState = { property: 'value' };
    component = new Component(application, rootComponent, name, additionalInitialState);

    subcomponent = new Component(application, rootComponent, 'subcomponentName');

    anotherSubcomponent = new Component(application, rootComponent, 'anotherSubcomponentName');

    application.start(rootComponent);
  });

  tman.afterEach(function () {
    application.stop();

    sinon.restore();
  });

  tman.suite('constructor', function () {
    tman.suite('with all arguments', function () {
      tman.test('should construct a Component instance', function () {
        assert.ok(component instanceof Component);
      });
    });

    tman.suite('with required arguments only', function () {
      tman.test('should construct a Component instance', function () {
        const anotherComponent = new Component(application, rootComponent, name);

        assert.ok(anotherComponent instanceof Component);
      });
    });

    tman.suite('with null as parent component', function () {
      tman.test('should construct a Component instance', function () {
        const anotherComponent = new Component(application, null, name);

        assert.ok(anotherComponent instanceof Component);
      });
    });
  });

  tman.suite('.initialState', function () {
    tman.test('should be an Object', function () {
      assert.ok(component.initialState instanceof Object);
    });

    tman.test('should contain additionalInitialState\'s properties', function () {
      assert.strictEqual(component.initialState.property, additionalInitialState.property);
    });

    tman.suite('.application', function () {
      tman.test('should return application', function () {
        assert.strictEqual(component.initialState.application, application);
      });
    });

    tman.suite('.parent', function () {
      tman.suite('of root component', function () {
        tman.test('should be null', function () {
          const anotherComponent = new Component(application, null, name, additionalInitialState);

          assert.strictEqual(anotherComponent.initialState.parent, null);
        });
      });

      tman.suite('of child component', function () {
        tman.test('should be refer to parent component', function () {
          assert.strictEqual(component.initialState.parent, rootComponent);
        });
      });
    });

    tman.suite('.name', function () {
      tman.test('should be equal to name', function () {
        assert.strictEqual(component.initialState.name, name);
      });
    });

    tman.suite('.component', function () {
      tman.test('should be equal to name', function () {
        assert.strictEqual(component.initialState.component, component);
      });
    });
  });

  tman.suite('.application', function () {
    tman.test('should return application', function () {
      assert.strictEqual(component.application, application);
    });
  });

  tman.suite('.parent', function () {
    tman.suite('of root component', function () {
      tman.test('should be null', function () {
        const anotherComponent = new Component(application, null, name, additionalInitialState);

        assert.strictEqual(anotherComponent.parent, null);
      });
    });

    tman.suite('of child component', function () {
      tman.test('should be refer to parent component', function () {
        assert.strictEqual(component.parent, rootComponent);
      });
    });
  });

  tman.suite('.name', function () {
    tman.test('should return name', function () {
      assert.strictEqual(component.name, name);
    });
  });

  tman.suite('.path', function () {
    tman.suite('of root component', function () {
      tman.test('should return array with name', function () {
        const anotherComponent = new Component(application, null, name, additionalInitialState);

        assert.deepEqual(anotherComponent.path, ['componentName']);
      });
    });

    tman.suite('of child component', function () {
      tman.test('should return array concatenated with parent\'s path', function () {
        assert.deepEqual(component.path, ['rootComponentName', 'componentName']);
      });
    });
  });

  tman.suite('.render', function () {
    tman.test('isn\'t implemented', function () {
      assert.throws(function () {
        component.render();
      }, /Not implemented/);
    });
  });

  tman.suite('.activate', function () {
    tman.test('should be declared', function () {
      component.activate();
    });
  });

  tman.suite('.deactivate (called after .activate)', function () {
    tman.test('should be declared', function () {
      component.deactivate();
    });
  });

  tman.suite('between .activate and .deactivate', function () {
    tman.beforeEach(function () {
      component.activate();
    });

    tman.afterEach(function () {
      component.deactivate();
    });

    tman.suite('.render', function () {
      tman.test('isn\'t implemented', function () {
        assert.throws(function () {
          component.render();
        }, /Not implemented/);
      });
    });

    tman.suite('.state', function () {
      tman.beforeEach(function () {
        sinon.stub(application, 'getComponentState');
      });

      tman.suite('of root component', function () {
        const rootComponentStateObject = {};

        tman.beforeEach(function () {
          application.getComponentState.withArgs(rootComponent.path).returns(rootComponentStateObject);
        });

        tman.test('should return root component\'s state', function () {
          const result = rootComponent.state;

          assert.strictEqual(result, rootComponentStateObject);
        });
      });

      tman.suite('of child component', function () {
        let childComponentStateObject;

        tman.beforeEach(function () {
          childComponentStateObject = {};
          application.getComponentState.withArgs(component.path).returns(childComponentStateObject);
        });

        tman.test('should return child component\'s state', function () {
          const result = component.state;

          assert.strictEqual(result, childComponentStateObject);
        });
      });
    });
  });

  tman.suite('.addSubcomponent', function () {
    tman.suite('with non-existant subcomponent', function () {
      tman.test('should return this', function () {
        const result = rootComponent.addSubcomponent(subcomponent);

        assert.strictEqual(result, rootComponent);
      });

      tman.test('should add subcomponent to subcomponents', function () {
        rootComponent.addSubcomponent(subcomponent);

        assert.strictEqual(rootComponent.getSubcomponent('subcomponentName'), subcomponent);
        assert.ok(rootComponent.subcomponentNames.indexOf('subcomponentName') !== -1);
      });
    });

    tman.suite('with existant subcomponent', function () {
      tman.beforeEach(function () {
        rootComponent.addSubcomponent(subcomponent);
        rootComponent.addSubcomponent(anotherSubcomponent);
      });

      tman.test('should throw error', function () {
        assert.throws(function () {
          rootComponent.addSubcomponent(subcomponent);
        }, /Subcomponent 'subcomponentName' already exists/);
      });

      tman.test('should not modify existant subcomponent', function () {
        assert.throws(function () {
          rootComponent.addSubcomponent(subcomponent);
        }, /Subcomponent 'subcomponentName' already exists/);

        assert.ok(rootComponent.subcomponentNames.indexOf('subcomponentName') !== -1);
        assert.strictEqual(rootComponent.getSubcomponent('subcomponentName'), subcomponent);
      });
    });

    tman.suite('with wrong parent', function () {
      tman.test('should throw error', function () {
        assert.throws(function () {
          subcomponent.addSubcomponent(anotherSubcomponent);
        }, /Subcomponent has different parent/);
      });
    });
  });

  tman.suite('.removeSubcomponent', function () {
    tman.suite('with existant subcomponent name', function () {
      tman.beforeEach(function () {
        rootComponent.addSubcomponent(subcomponent);
        rootComponent.addSubcomponent(anotherSubcomponent);
      });

      tman.test('should return this', function () {
        const result = rootComponent.removeSubcomponent('subcomponentName');

        assert.strictEqual(result, rootComponent);
      });

      tman.test('should remove subcomponent', function () {
        rootComponent.removeSubcomponent('subcomponentName');

        assert.ok(rootComponent.subcomponentNames.indexOf('subcomponentName') === -1);
        assert.throws(function () {
          rootComponent.getSubcomponent('subcomponentName');
        }, /Subcomponent 'subcomponentName' doesn't exist/);
      });

      tman.test('should not modify other subcomponents', function () {
        rootComponent.removeSubcomponent('subcomponentName');

        assert.ok(rootComponent.subcomponentNames.indexOf('anotherSubcomponentName') !== -1);
        assert.strictEqual(rootComponent.getSubcomponent('anotherSubcomponentName'), anotherSubcomponent);
      });
    });

    tman.suite('with non-existant subcomponent name', function () {
      tman.test('should throw error', function () {
        assert.throws(function () {
          rootComponent.removeSubcomponent('wrongSubcomponentName');
        }, /Subcomponent 'wrongSubcomponentName' doesn't exist/);
      });
    });
  });

  tman.suite('.getSubcomponentNames', function () {
    tman.test('should return subcomponent names', function () {
      assert.deepEqual(rootComponent.subcomponentNames, []);
    });

    // see also .addSubcomponent and .removeSubcomponent tests
  });

  tman.suite('.getSubcomponent', function () {
    // see also .addSubcomponent and .removeSubcomponent tests
  });
});
