import {
  Cursor_FreezerJs as Cursor,
  Loop_Snabbdom as Loop,
} from 'rotorjs/middlewares';
import { getRotorJsClasses } from 'rotorjs';

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
