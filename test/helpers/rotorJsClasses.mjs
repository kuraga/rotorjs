import {
  Cursor_FreezerJs as Cursor,
  Loop_VirtualDom as Loop,
  Trie_RouteTrie as Trie
} from '../../middlewares';
import { getRotorJsClasses } from '../../index';

const middleware = {
  Cursor,
  Loop,
  Trie
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
