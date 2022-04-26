import tman from 'tman';
import assert from 'assert';
import sinon from 'sinon';

import {
  Application,
  Component,
  ChildlyComponent
} from './helpers/rotorJsClasses.mjs';

import { h } from 'snabbdom';

function patchApplication(application) {
  // WARNING: Avoid renderInvalidRoute at application start
  application.render = function () {
    return h('span');
  };
  application.__renderBinded = application.render.bind(application);
}

tman.mocha();

tman.suite('ChildlyComponent', function () {
  let application, childlyComponent,
    anotherApplication, anotherChildlyComponent, anotherChildlyComponentRenderInvalidRouteResult,
    aboutComponent, aboutComponentRenderResult,
    userComponent;

  tman.beforeEach(function () {
    application = new Application();
    patchApplication(application);

    childlyComponent = new ChildlyComponent(application, null, 'childlyComponentName');

    application.start(childlyComponent);


    aboutComponentRenderResult = h('span', { id: 'about' }, [
      'About'
    ]);

    class AboutComponent extends Component {
      render() {
        return aboutComponentRenderResult;
      }
    }

    class UserComponent extends Component {
    }

    anotherChildlyComponentRenderInvalidRouteResult = h('span');

    class SpecifiedChildlyComponent extends ChildlyComponent {
      __match(...args) {
        if (args.length === 2 && args[0] === 'correct' && args[1] === 'path') {
          aboutComponent = new AboutComponent(this.application, this, 'aboutComponentName');

          sinon.spy(aboutComponent, 'activate');
          sinon.spy(aboutComponent, 'render');
          sinon.spy(aboutComponent, 'deactivate');

          return aboutComponent;
        } else if (args.length === 3 && args[0] === 'another' && args[1] === 'correct' && args[2] === 'path') {
          userComponent = new UserComponent(this.application, this, 'userComponentName');

          sinon.spy(userComponent, 'activate');
          sinon.spy(userComponent, 'deactivate');

          return userComponent;
        }

        return null;
      }

      renderInvalidRoute() {
        return anotherChildlyComponentRenderInvalidRouteResult;
      }
    }

    anotherApplication = new Application();
    patchApplication(anotherApplication);

    anotherChildlyComponent = new SpecifiedChildlyComponent(anotherApplication, null, 'anotherChildlyComponentName');
    sinon.spy(anotherChildlyComponent, 'renderInvalidRoute');

    anotherApplication.start(anotherChildlyComponent);
  });

  tman.afterEach(function () {
    application.stop();

    sinon.restore();
  });

  tman.suite('constructor', function () {
    tman.test('should construct a RouterComponent instance', function () {
      assert.ok(childlyComponent instanceof ChildlyComponent);
      assert.ok(childlyComponent instanceof Component);
    });

    tman.test('should accept 3 arguments', function () {
      const oneMoreChildlyComponent = new ChildlyComponent(application, null, 'anotherChildlyComponentName');

      assert.ok(oneMoreChildlyComponent instanceof ChildlyComponent);
      assert.ok(oneMoreChildlyComponent instanceof Component);
    });
  });

  tman.suite('.currentComponentName', function () {
    tman.test('should be undefined after construction', function () {
      assert.strictEqual(childlyComponent.currentComponentName, undefined);
    });
  });

  tman.suite('.currentComponent', function () {
    tman.test('should be undefined after construction', function () {
      assert.strictEqual(childlyComponent.currentComponent, undefined);
    });
  });

  tman.suite('.renderInvalidRoute', function () {
    tman.test('isn\'t implemented', function () {
      assert.throws(function () {
        childlyComponent.renderInvalidRoute();
      }, /Not implemented/);
    });
  });

  tman.suite('.__match', function () {
    tman.test('isn\'t implemented', function () {
      assert.throws(function () {
        childlyComponent.__match();
      }, /Not implemented/);
    });
  });

  tman.suite('.render', function () {
    tman.test('should return result of .renderInvalidRoute', function () {
      const result = anotherChildlyComponent.render();

      assert.ok(anotherChildlyComponent.renderInvalidRoute.calledOnce);
      assert.ok(anotherChildlyComponent.renderInvalidRoute.calledWithExactly());
      assert.ok(anotherChildlyComponent.renderInvalidRoute.calledOn(anotherChildlyComponent));
      assert.strictEqual(result, anotherChildlyComponentRenderInvalidRouteResult);
    });
  });

  tman.suite('.route', function () {
    tman.test('should call __match with correct data', function () {
      sinon.spy(anotherChildlyComponent, '__match');

      anotherChildlyComponent.route('correct', 'path');

      assert.ok(anotherChildlyComponent.__match.calledOnce);
      assert.ok(anotherChildlyComponent.__match.calledWithExactly('correct', 'path'));
      assert.ok(anotherChildlyComponent.__match.calledOn(anotherChildlyComponent));
    });

    tman.suite('with correct path', function () {
      tman.test('should return true', function () {
        const result = anotherChildlyComponent.route('correct', 'path');

        assert.strictEqual(result, true);
      });

      tman.test('should activate new component', function () {
        anotherChildlyComponent.route('correct', 'path');

        assert.ok(aboutComponent.activate.calledOnce);
        assert.ok(aboutComponent.activate.calledWithExactly());
        assert.ok(aboutComponent.activate.calledOn(aboutComponent));
      });

      tman.it.skip('should activate new component after adding it to the state', function () {
        // FIXME: aboutComponent is constructed in initializer so we really don't stub it here
        sinon.stub(aboutComponent, 'activate').callsFake(function (...args) {  // eslint-disable-line no-unused-vars
          assert.strictEqual(anotherChildlyComponent.currentComponentName, 'userComponentName');
          assert.strictEqual(anotherChildlyComponent.currentComponent, userComponent);
        });

        anotherChildlyComponent.route('about');
      });
    });

    tman.suite('with incorrect path', function () {
      tman.test('should return false', function () {
        const result = anotherChildlyComponent.route('incorrect', 'path');

        assert.strictEqual(result, false);
      });
    });
  });

  tman.suite('after .route with correct path', function () {
    tman.beforeEach(function () {
      anotherChildlyComponent.route('correct', 'path');
    });

    tman.suite('.currentComponentName', function () {
      tman.test('should be equal to respective component name', function () {
        assert.strictEqual(anotherChildlyComponent.currentComponentName, 'aboutComponentName');
      });
    });

    tman.suite('.currentComponent', function () {
      tman.test('should refer to respective component', function () {
        assert.strictEqual(anotherChildlyComponent.currentComponent, aboutComponent);
      });
    });

    tman.suite('.render', function () {
      tman.test('should return result of correct component\'s .render', function () {
        const result = anotherChildlyComponent.render();

        assert.ok(aboutComponent.render.calledOnce);
        assert.ok(aboutComponent.render.calledWithExactly());
        assert.ok(aboutComponent.render.calledOn(aboutComponent));
        assert.strictEqual(result, aboutComponentRenderResult);
      });
    });

    tman.suite('.deactivate', function () {
      tman.test('should deactivate subcomponents', function () {
        anotherChildlyComponent.deactivate();

        assert.ok(aboutComponent.deactivate.calledOnce);
        assert.ok(aboutComponent.deactivate.calledWithExactly());
        assert.ok(aboutComponent.deactivate.calledOn(aboutComponent));
      });

      tman.test('should remove subcomponents', function () {
        anotherChildlyComponent.deactivate();

        assert.deepEqual(anotherChildlyComponent.subcomponentNames, []);
        assert.throws(function () {
          anotherChildlyComponent.getSubcomponent('aboutComponentName');
        }, /Subcomponent 'aboutComponentName' doesn't exist/);
      });
    });

    tman.suite('.route', function () {
      tman.suite('with correct path', function () {
        tman.test('should return true', function () {
          const result = anotherChildlyComponent.route('another', 'correct', 'path');

          assert.strictEqual(result, true);
        });

        tman.test('should deactivate old component', function () {
          anotherChildlyComponent.route('another', 'correct', 'path');

          assert.ok(aboutComponent.deactivate.calledOnce);
          assert.ok(aboutComponent.deactivate.calledWithExactly());
          assert.ok(aboutComponent.deactivate.calledOn(aboutComponent));
        });

        tman.test('should activate new component', function () {
          anotherChildlyComponent.route('another', 'correct', 'path');

          assert.ok(userComponent.activate.calledOnce);
          assert.ok(userComponent.activate.calledWithExactly());
          assert.ok(userComponent.activate.calledOn(userComponent));
        });

        tman.test('should activate new component after deactivating old component', function () {
          anotherChildlyComponent.route('another', 'correct', 'path');

          assert.ok(userComponent.activate.calledAfter(aboutComponent.deactivate));
        });
      });

      tman.suite('with incorrect path', function () {
        tman.test('should return false', function () {
          const result = anotherChildlyComponent.route('another', 'incorrect', 'path');

          assert.strictEqual(result, false);
        });
      });
    });
  });

  tman.suite('after .route with incorrect path', function () {
    tman.beforeEach(function () {
      anotherChildlyComponent.route('incorrect', 'path');
    });

    tman.suite('.currentComponentName', function () {
      tman.test('should be null', function () {
        assert.strictEqual(anotherChildlyComponent.currentComponentName, null);
      });
    });

    tman.suite('.currentComponent', function () {
      tman.test('should be null', function () {
        assert.strictEqual(anotherChildlyComponent.currentComponent, null);
      });
    });

    tman.suite('.render', function () {
      tman.test('should return result of .renderInvalidRoute', function () {
        const result = anotherChildlyComponent.render();

        assert.ok(anotherChildlyComponent.renderInvalidRoute.calledOnce);
        assert.ok(anotherChildlyComponent.renderInvalidRoute.calledWithExactly());
        assert.ok(anotherChildlyComponent.renderInvalidRoute.calledOn(anotherChildlyComponent));
        assert.strictEqual(result, anotherChildlyComponentRenderInvalidRouteResult);
      });
    });

    tman.suite('.route', function () {
      tman.suite('with correct path', function () {
        tman.test('should return true', function () {
          const result = anotherChildlyComponent.route('another', 'correct', 'path');

          assert.strictEqual(result, true);
        });

        tman.test('should activate new component', function () {
          anotherChildlyComponent.route('another', 'correct', 'path');

          assert.ok(userComponent.activate.calledOnce);
          assert.ok(userComponent.activate.calledWithExactly());
          assert.ok(userComponent.activate.calledOn(userComponent));
        });
      });

      tman.suite('with incorrect path', function () {
        tman.test('should return false', function () {
          const result = anotherChildlyComponent.route('another', 'incorrect', 'path');

          assert.strictEqual(result, false);
        });
      });
    });
  });
});
