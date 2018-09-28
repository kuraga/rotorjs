import tman from 'tman';
import assert from 'assert';
import sinon from 'sinon';

import {
  Application,
  Component,
  RouterComponent
} from './helpers/rotorJsClasses';

import h from 'virtual-dom/h';

tman.mocha();

let sandbox;

tman.suite('RouterComponent', function () {
  let application,
    name, routerComponent,
    firstComponent, firstComponentRenderResult, secondComponent,
    firstPattern, secondPattern,
    firstInitializer, firstInitializerSpy, secondInitializer, secondInitializerSpy,
    routes,
    firstRouteCorrectPath, secondRouteCorrectPath, secondRouteCorrectPathParams, wrongPath;

  tman.beforeEach(function () {
    sandbox = sinon.sandbox.create();
    application = new Application();
    application.render = function () {  // avoid routerComponent.renderInvalidRoute at application start
      return h('span');
    };
    application.__renderBinded = application.render.bind(application);
    name = 'routerComponentName';
    firstPattern = 'some/simple|difficult/path/:id';
    firstComponentRenderResult = h('span');
    firstInitializer = function (match, router) {  // eslint-disable-line no-unused-vars
      firstComponent = new Component(application, router, 'firstComponentName');
      sandbox.stub(firstComponent, 'render');
      firstComponent.render.returns(firstComponentRenderResult);
      sandbox.spy(firstComponent, 'deactivate');
      return firstComponent;
    };
    firstInitializerSpy = sandbox.spy(firstInitializer);
    secondPattern = '/:id([0-9]*)/another/:way/to/((make)?)/:stuff(*)';
    secondInitializer = function (match, router) {  // eslint-disable-line no-unused-vars
      secondComponent = new Component(application, router, 'secondComponentName');
      sandbox.spy(secondComponent, 'activate');
      return secondComponent;
    };
    secondInitializerSpy = sandbox.spy(secondInitializer);
    routes = {
      [firstPattern]: firstInitializerSpy,
      [secondPattern]: secondInitializerSpy
    };
    firstRouteCorrectPath = 'some/simple/path/12';
    secondRouteCorrectPath = '/147/another/the_99_way/to/make/blah/blah';
    secondRouteCorrectPathParams = { id: '147', way: 'the_99_way', stuff: 'blah/blah' };
    wrongPath = '/wrong/another/the_99_way/to/make/everybody/happy';
    routerComponent = new RouterComponent(application, null, name, routes);

    application.start(routerComponent);
  });

  tman.afterEach(function () {
    application.stop();

    sandbox.restore();
  });

  tman.suite('constructor', function () {
    tman.suite('with all arguments', function () {
      tman.test('should construct a RouterComponent instance', function () {
        assert.ok(routerComponent instanceof RouterComponent);
        assert.ok(routerComponent instanceof Component);
      });
    });

    tman.suite('with required arguments only', function () {
      tman.test('should construct a RouterComponent (extends Component) instance', function () {
        const anotherRouterComponent = new RouterComponent(application, null, name);

        assert.ok(anotherRouterComponent instanceof RouterComponent);
        assert.ok(anotherRouterComponent instanceof Component);
      });
    });
  });

  tman.suite('.currentComponentName', function () {
    tman.test('should be undefined', function () {
      assert.strictEqual(routerComponent.currentComponentName, undefined);
    });
  });

  tman.suite('.currentComponent', function () {
    tman.test('should be undefined', function () {
      assert.strictEqual(routerComponent.currentComponent, undefined);
    });
  });

  tman.suite('.renderInvalidRoute', function () {
    tman.test('isn\'t implemented', function () {
      assert.throws(function () {
        routerComponent.renderInvalidRoute();
      }, /Not implemented/);
    });
  });

  tman.suite('.render', function () {
    tman.test('should return result of .renderInvalidRoute', function () {
      const routerComponentRenderInvalidRouteResult = h('span');
      sandbox.stub(routerComponent, 'renderInvalidRoute').returns(routerComponentRenderInvalidRouteResult);

      const result = routerComponent.render();

      assert.ok(routerComponent.renderInvalidRoute.calledOnce);
      assert.ok(routerComponent.renderInvalidRoute.calledWithExactly());
      assert.ok(routerComponent.renderInvalidRoute.calledOn(routerComponent));
      assert.strictEqual(result, routerComponentRenderInvalidRouteResult);
    });
  });

  tman.suite('.route', function () {
    tman.suite('with correct path', function () {
      tman.test('should return true', function () {
        const result = routerComponent.route(secondRouteCorrectPath);

        assert.strictEqual(result, true);
      });

      tman.test('should call correct initializer', function () {
        secondInitializerSpy.reset();

        routerComponent.route(secondRouteCorrectPath);

        assert.ok(secondInitializerSpy.calledOnce);
        assert.ok(secondInitializerSpy.calledOn(undefined));
        assert.ok(secondInitializerSpy.firstCall.args[0] instanceof Object);
        assert.deepEqual(secondInitializerSpy.firstCall.args[0].params, secondRouteCorrectPathParams);
        assert.strictEqual(secondInitializerSpy.firstCall.args[1], routerComponent);
      });

      tman.test('should not call other initializers', function () {
        firstInitializerSpy.reset();

        routerComponent.route(secondRouteCorrectPath);

        assert.ok(firstInitializerSpy.notCalled);
      });

      tman.test('should activate new component', function () {
        routerComponent.route(secondRouteCorrectPath);

        assert.ok(secondComponent.activate.calledOnce);
        assert.ok(secondComponent.activate.calledWithExactly());
        assert.ok(secondComponent.activate.calledOn(secondComponent));
      });

      tman.test('should activate new component after adding it to the state', function () {
        secondComponent.oldActivate = secondComponent.activate;
        secondComponent.activate = function (...args) {
          assert.strictEqual(routerComponent.currentComponentName, 'secondComponentName');
          assert.strictEqual(routerComponent.currentComponent, secondComponent);
          return this.oldActivate(...args);
        };

        routerComponent.route(secondRouteCorrectPath);
      });
    });

    tman.suite('with incorrect path', function () {
      tman.test('should return false', function () {
        const result = routerComponent.route(wrongPath);

        assert.strictEqual(result, false);
      });

      tman.test('should not call initializers', function () {
        firstInitializerSpy.reset();
        secondInitializerSpy.reset();

        routerComponent.route(wrongPath);

        assert.ok(firstInitializerSpy.notCalled);
        assert.ok(secondInitializerSpy.notCalled);
      });
    });
  });

  tman.suite('after .route with correct path', function () {
    tman.beforeEach(function () {
      routerComponent.route(firstRouteCorrectPath);
    });

    tman.suite('.currentComponentName', function () {
      tman.test('should be equal to respective component name', function () {
        assert.strictEqual(routerComponent.currentComponentName, 'firstComponentName');
      });
    });

    tman.suite('.currentComponent', function () {
      tman.test('should refer to respective component', function () {
        assert.strictEqual(routerComponent.currentComponent, firstComponent);
      });
    });

    tman.suite('.render', function () {
      tman.test('should return result of correct component\'s .render', function () {
        firstComponent.render.reset();

        const result = routerComponent.render();

        assert.ok(firstComponent.render.calledOnce);
        assert.ok(firstComponent.render.calledWithExactly());
        assert.ok(firstComponent.render.calledOn(firstComponent));
        assert.strictEqual(result, firstComponentRenderResult);
      });
    });


    tman.suite('.deactivate', function () {
      tman.test('should deactivate subcomponents', function () {
        firstComponent.deactivate.reset();

        routerComponent.deactivate();

        assert.ok(firstComponent.deactivate.calledOnce);
        assert.ok(firstComponent.deactivate.calledWithExactly());
        assert.ok(firstComponent.deactivate.calledOn(firstComponent));
      });

      tman.test('should remove subcomponents', function () {
        routerComponent.deactivate();

        assert.deepEqual(routerComponent.subcomponentNames, []);
        assert.throws(function () {
          routerComponent.getSubcomponent('firstComponentName');
        }, /Subcomponent 'firstComponentName' doesn't exist/);
      });
    });

    tman.suite('.route', function () {
      tman.suite('with correct path', function () {
        tman.test('should return true', function () {
          const result = routerComponent.route(secondRouteCorrectPath);

          assert.strictEqual(result, true);
        });

        tman.test('should deactivate old component', function () {
          routerComponent.route(secondRouteCorrectPath);

          assert.ok(firstComponent.deactivate.calledOnce);
          assert.ok(firstComponent.deactivate.calledWithExactly());
          assert.ok(firstComponent.deactivate.calledOn(firstComponent));
        });

        tman.test('should activate new component', function () {
          routerComponent.route(secondRouteCorrectPath);

          assert.ok(secondComponent.activate.calledOnce);
          assert.ok(secondComponent.activate.calledWithExactly());
          assert.ok(secondComponent.activate.calledOn(secondComponent));
        });

        tman.test('should activate new component after deactivating old component', function () {
          routerComponent.route(secondRouteCorrectPath);

          assert.ok(secondComponent.activate.calledAfter(firstComponent.deactivate));
        });
      });

      tman.suite('with incorrect path', function () {
        tman.test('should return false', function () {
          const result = routerComponent.route(wrongPath);

          assert.strictEqual(result, false);

        });

        tman.test('should not call initializers', function () {
          firstInitializerSpy.reset();
          secondInitializerSpy.reset();

          routerComponent.route(wrongPath);

          assert.ok(firstInitializerSpy.notCalled);
          assert.ok(secondInitializerSpy.notCalled);
        });
      });
    });
  });

  tman.suite('after .route with incorrect path', function () {
    tman.beforeEach(function () {
      routerComponent.route(wrongPath);
    });

    tman.suite('.currentComponentName', function () {
      tman.test('should be null', function () {
        assert.strictEqual(routerComponent.currentComponentName, null);
      });
    });

    tman.suite('.currentComponent', function () {
      tman.test('should be null', function () {
        assert.strictEqual(routerComponent.currentComponent, null);
      });
    });

    tman.suite('.render', function () {
      tman.test('should return result of .renderInvalidRoute', function () {
        const routerComponentRenderInvalidRouteResult = h('span');
        sandbox.stub(routerComponent, 'renderInvalidRoute').returns(routerComponentRenderInvalidRouteResult);

        const result = routerComponent.render();

        assert.ok(routerComponent.renderInvalidRoute.calledOnce);
        assert.ok(routerComponent.renderInvalidRoute.calledWithExactly());
        assert.ok(routerComponent.renderInvalidRoute.calledOn(routerComponent));
        assert.strictEqual(result, routerComponentRenderInvalidRouteResult);
      });
    });

    tman.suite('.route', function () {
      tman.suite('with correct path', function () {
        tman.test('should return true', function () {
          const result = routerComponent.route(secondRouteCorrectPath);

          assert.strictEqual(result, true);
        });

        tman.test('should activate new component', function () {
          routerComponent.route(secondRouteCorrectPath);

          assert.ok(secondComponent.activate.calledOnce);
          assert.ok(secondComponent.activate.calledWithExactly());
          assert.ok(secondComponent.activate.calledOn(secondComponent));
        });
      });

      tman.suite('with incorrect path', function () {
        tman.test('should return false', function () {
          const result = routerComponent.route(wrongPath);

          assert.strictEqual(result, false);
        });

        tman.test('should not call initializers', function () {
          firstInitializerSpy.reset();
          secondInitializerSpy.reset();

          routerComponent.route(wrongPath);

          assert.ok(firstInitializerSpy.notCalled);
          assert.ok(secondInitializerSpy.notCalled);
        });
      });
    });
  });
});
