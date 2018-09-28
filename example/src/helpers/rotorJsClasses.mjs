import {
  Cursor_FreezerJs as Cursor,
  Loop_VirtualDom as Loop,
  PathNode_TinyPathMatcher as PathNode
} from 'rotorjs/middlewares';
import { getRotorJsClasses } from 'rotorjs';

const middleware = {
  Cursor,
  Loop,
  PathNode
};

const {
  Application,
  Component,
  RouterComponent
} = getRotorJsClasses(middleware);

export {
  Application,
  Component,
  RouterComponent
};
