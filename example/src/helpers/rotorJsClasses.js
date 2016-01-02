import {
  Cursor_FreezerJs as Cursor,
  Loop_VirtualDom as Loop,
  Trie_RouteTrie as Trie
} from 'rotorjs/middlewares';
import { getRotorJsClasses } from 'rotorjs';

let middleware = {
  Cursor,
  Loop,
  Trie
};

let {
  Application,
  Component,
  RouterComponent
} = getRotorJsClasses(middleware);

export {
  Application,
  Component,
  RouterComponent
};
