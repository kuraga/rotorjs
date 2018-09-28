import getApplicationClass from './application.mjs';
import getComponentClass from './component.mjs';
import getRouterComponentClass from './routerComponent.mjs';

export default function getRotorJsClasses(middleware) {
  const {
    Cursor,
    Loop,
    PathNode
  } = middleware;

  const Application = getApplicationClass(Cursor, Loop),
    Component = getComponentClass(),
    RouterComponent = getRouterComponentClass(Component, PathNode);

  return {
    Application,
    Component,
    RouterComponent
  };
}
