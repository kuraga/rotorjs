import {
  Cursor_FreezerJs as Cursor,
  Loop_Snabbdom as Loop,
} from '../../middlewares';
import { getRotorJsClasses } from '../../index';

const middleware = {
  Cursor,
  Loop
};

const {
  Application,
  Component,
  ChildlyComponent
} = getRotorJsClasses(middleware);

export {
  Application,
  Component,
  ChildlyComponent
};
