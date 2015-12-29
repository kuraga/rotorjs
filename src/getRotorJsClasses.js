import getApplicationClass from './application';
import getComponentClass from './component';
import getRouterComponentClass from './routerComponent';

export default function getRotorJsClasses(middleware) {
  let {
    Cursor,
    Loop,
    Trie
  } = middleware;

  let Application = getApplicationClass(Cursor, Loop),
    Component = getComponentClass(),
    RouterComponent = getRouterComponentClass(Component, Trie);

  return {
    Application,
    Component,
    RouterComponent
  };
}
