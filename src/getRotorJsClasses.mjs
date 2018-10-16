import getApplicationClass from './application.mjs';
import getComponentClass from './component.mjs';
import getChildlyComponentClass from './childlyComponent.mjs';

export default function getRotorJsClasses(middleware) {
  const {
    Cursor,
    Loop
  } = middleware;

  const Application = getApplicationClass(Cursor, Loop),
    Component = getComponentClass(),
    ChildlyComponent = getChildlyComponentClass(Component);

  return {
    Application,
    Component,
    ChildlyComponent
  };
}
