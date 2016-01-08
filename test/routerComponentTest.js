import test from 'tapes';
import sinon from 'sinon';

import {
  Application,
  Component,
  RouterComponent
} from './helpers/rotorJsClasses';

import h from 'virtual-dom/h';

let sandbox;

test('RouterComponent', function (t) {
  let application,
    name, routerComponent,
    firstComponent, firstComponentRenderResult, secondComponent,
    firstPattern, secondPattern,
    firstInitializer, firstInitializerSpy, secondInitializer, secondInitializerSpy,
    routes,
    firstRouteCorrectPath, secondRouteCorrectPath, secondRouteCorrectPathParams, wrongPath;

  t.beforeEach(function (t) {
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

    t.end();
  });

  t.afterEach(function (t) {
    application.stop();

    sandbox.restore();

    t.end();
  });

  t.test('constructor', function (t) {
    t.test('with all arguments', function (t) {
      t.test('should construct a RouterComponent instance', function (t) {
        t.assert(routerComponent instanceof RouterComponent);
        t.assert(routerComponent instanceof Component);

        t.end();
      });

      t.end();
    });

    t.test('with required arguments only', function (t) {
      t.test('should construct a RouterComponent (extends Component) instance', function (t) {
        let anotherRouterComponent = new RouterComponent(application, null, name);

        t.assert(anotherRouterComponent instanceof RouterComponent);
        t.assert(anotherRouterComponent instanceof Component);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('.currentComponentName', function (t) {
    t.test('should be undefined', function (t) {
      t.is(routerComponent.currentComponentName, undefined);

      t.end();
    });

    t.end();
  });

  t.test('.currentComponent', function (t) {
    t.test('should be undefined', function (t) {
      t.is(routerComponent.currentComponent, undefined);

      t.end();
    });

    t.end();
  });

  t.test('.renderInvalidRoute', function (t) {
    t.test('isn\'t implemented', function (t) {
      t.throws(function () {
        routerComponent.renderInvalidRoute();
      }, /Not implemented/);

      t.end();
    });

    t.end();
  });

  t.test('.render', function (t) {
    t.test('should return result of .renderInvalidRoute', function (t) {
      let routerComponentRenderInvalidRouteResult = h('span');
      sandbox.stub(routerComponent, 'renderInvalidRoute').returns(routerComponentRenderInvalidRouteResult);

      let result = routerComponent.render();

      t.assert(routerComponent.renderInvalidRoute.calledOnce);
      t.assert(routerComponent.renderInvalidRoute.calledWithExactly());
      t.assert(routerComponent.renderInvalidRoute.calledOn(routerComponent));
      t.is(result, routerComponentRenderInvalidRouteResult);

      t.end();
    });

    t.end();
  });

  t.test('.route', function (t) {
    t.test('with correct path', function (t) {
      t.test('should return true', function (t) {
        let result = routerComponent.route(secondRouteCorrectPath);

        t.is(result, true);

        t.end();
      });

      t.test('should call correct initializer', function (t) {
        secondInitializerSpy.reset();

        routerComponent.route(secondRouteCorrectPath);

        t.assert(secondInitializerSpy.calledOnce);
        t.assert(secondInitializerSpy.calledOn(undefined));
        t.assert(secondInitializerSpy.firstCall.args[0] instanceof Object);
        t.deepEqual(secondInitializerSpy.firstCall.args[0].params, secondRouteCorrectPathParams);
        t.is(secondInitializerSpy.firstCall.args[1], routerComponent);

        t.end();
      });

      t.test('should not call other initializers', function (t) {
        firstInitializerSpy.reset();

        routerComponent.route(secondRouteCorrectPath);

        t.assert(firstInitializerSpy.notCalled);

        t.end();
      });

      t.test('should activate new component', function (t) {
        routerComponent.route(secondRouteCorrectPath);

        t.assert(secondComponent.activate.calledOnce);
        t.assert(secondComponent.activate.calledWithExactly());
        t.assert(secondComponent.activate.calledOn(secondComponent));

        t.end();
      });

      t.test('should activate new component after adding it to the state', function (t) {
        secondComponent.oldActivate = secondComponent.activate;
        secondComponent.activate = function (...args) {
          t.is(routerComponent.currentComponentName, 'secondComponentName');
          t.is(routerComponent.currentComponent, secondComponent);
          return this.oldActivate(...args);
        };

        routerComponent.route(secondRouteCorrectPath);

        t.end();
      });

      t.end();
    });

    t.test('with incorrect path', function (t) {
      t.test('should return false', function (t) {
        let result = routerComponent.route(wrongPath);

        t.is(result, false);

        t.end();
      });

      t.test('should not call initializers', function (t) {
        firstInitializerSpy.reset();
        secondInitializerSpy.reset();

        routerComponent.route(wrongPath);

        t.assert(firstInitializerSpy.notCalled);
        t.assert(secondInitializerSpy.notCalled);

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('after .route with correct path', function (t) {
    t.beforeEach(function (t) {
      routerComponent.route(firstRouteCorrectPath);

      t.end();
    });

    t.test('.currentComponentName', function (t) {
      t.test('should be equal to respective component name', function (t) {
        t.is(routerComponent.currentComponentName, 'firstComponentName');

        t.end();
      });

    t.end();
    });

    t.test('.currentComponent', function (t) {
      t.test('should refer to respective component', function (t) {
        t.is(routerComponent.currentComponent, firstComponent);

        t.end();
      });

      t.end();
    });

    t.test('.render', function (t) {
      t.test('should return result of correct component\'s .render', function (t) {
        firstComponent.render.reset();

        let result = routerComponent.render();

        t.assert(firstComponent.render.calledOnce);
        t.assert(firstComponent.render.calledWithExactly());
        t.assert(firstComponent.render.calledOn(firstComponent));
        t.is(result, firstComponentRenderResult);

        t.end();
      });

      t.end();
    });


    t.test('.deactivate', function (t) {
      t.test('should deactivate subcomponents', function (t) {
        firstComponent.deactivate.reset();

        routerComponent.deactivate();

        t.assert(firstComponent.deactivate.calledOnce);
        t.assert(firstComponent.deactivate.calledWithExactly());
        t.assert(firstComponent.deactivate.calledOn(firstComponent));

        t.end();
      });

      t.test('should remove subcomponents', function (t) {
        routerComponent.deactivate();

        t.deepEquals(routerComponent.subcomponentNames, []);
        t.throws(function () {
          routerComponent.getSubcomponent('firstComponentName');
        }, /Subcomponent 'firstComponentName' doesn't exist/);

        t.end();
      });

      t.end();
    });

    t.test('.route', function (t) {
      t.test('with correct path', function (t) {
        t.test('should return true', function (t) {
          let result = routerComponent.route(secondRouteCorrectPath);

          t.is(result, true);

          t.end();
        });

        t.test('should deactivate old component', function (t) {
          routerComponent.route(secondRouteCorrectPath);

          t.assert(firstComponent.deactivate.calledOnce);
          t.assert(firstComponent.deactivate.calledWithExactly());
          t.assert(firstComponent.deactivate.calledOn(firstComponent));

          t.end();
        });

        t.test('should activate new component', function (t) {
          routerComponent.route(secondRouteCorrectPath);

          t.assert(secondComponent.activate.calledOnce);
          t.assert(secondComponent.activate.calledWithExactly());
          t.assert(secondComponent.activate.calledOn(secondComponent));

          t.end();
        });

        t.test('should activate new component after deactivating old component', function (t) {
          routerComponent.route(secondRouteCorrectPath);

          t.assert(secondComponent.activate.calledAfter(firstComponent.deactivate));

          t.end();
        });

        t.end();
      });

      t.test('with incorrect path', function (t) {
        t.test('should return false', function (t) {
          let result = routerComponent.route(wrongPath);

          t.is(result, false);

          t.end();

        });

        t.test('should not call initializers', function (t) {
          firstInitializerSpy.reset();
          secondInitializerSpy.reset();

          routerComponent.route(wrongPath);

          t.assert(firstInitializerSpy.notCalled);
          t.assert(secondInitializerSpy.notCalled);

          t.end();
        });

        t.end();
      });

      t.end();
    });

    t.end();
  });

  t.test('after .route with incorrect path', function (t) {
    t.beforeEach(function (t) {
      routerComponent.route(wrongPath);

      t.end();
    });

    t.test('.currentComponentName', function (t) {
      t.test('should be null', function (t) {
        t.is(routerComponent.currentComponentName, null);

        t.end();
      });

      t.end();
    });

    t.test('.currentComponent', function (t) {
      t.test('should be null', function (t) {
        t.is(routerComponent.currentComponent, null);

        t.end();
      });

      t.end();
    });

    t.test('.render', function (t) {
      t.test('should return result of .renderInvalidRoute', function (t) {
        let routerComponentRenderInvalidRouteResult = h('span');
        sandbox.stub(routerComponent, 'renderInvalidRoute').returns(routerComponentRenderInvalidRouteResult);

        let result = routerComponent.render();

        t.assert(routerComponent.renderInvalidRoute.calledOnce);
        t.assert(routerComponent.renderInvalidRoute.calledWithExactly());
        t.assert(routerComponent.renderInvalidRoute.calledOn(routerComponent));
        t.is(result, routerComponentRenderInvalidRouteResult);

        t.end();
      });

      t.end();
    });

    t.test('.route', function (t) {
      t.test('with correct path', function (t) {
        t.test('should return true', function (t) {
          let result = routerComponent.route(secondRouteCorrectPath);

          t.is(result, true);

          t.end();
        });

        t.test('should activate new component', function (t) {
          routerComponent.route(secondRouteCorrectPath);

          t.assert(secondComponent.activate.calledOnce);
          t.assert(secondComponent.activate.calledWithExactly());
          t.assert(secondComponent.activate.calledOn(secondComponent));

          t.end();
        });

        t.end();
      });

      t.test('with incorrect path', function (t) {
        t.test('should return false', function (t) {
          let result = routerComponent.route(wrongPath);

          t.is(result, false);

          t.end();
        });

        t.test('should not call initializers', function (t) {
          firstInitializerSpy.reset();
          secondInitializerSpy.reset();

          routerComponent.route(wrongPath);

          t.assert(firstInitializerSpy.notCalled);
          t.assert(secondInitializerSpy.notCalled);

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
