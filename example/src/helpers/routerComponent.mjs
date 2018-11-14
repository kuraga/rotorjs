import { ChildlyComponent } from './rotorJsClasses.mjs';
import { PathNode } from 'tiny-path-matcher';

export default class RouterComponent extends ChildlyComponent {
  constructor(application, parent, name, rootPathNode) {
    const initialState = {
      __rootPathNode: rootPathNode
    };
    super(application, parent, name, initialState);
  }

  __match(uri) {
    const routePath = uri.split('/')
      .filter((chunk) => chunk.length > 0);

    const matched = this.state.__rootPathNode.match(routePath);
    if (matched !== null) {
      const [ matchedPathNode, matchedPathArguments ] = matched;

      if (matchedPathNode.data === undefined || !('initializer' in matchedPathNode.data)) {
        return null;
      }

      const component = (0, matchedPathNode.data.initializer)(matchedPathNode, matchedPathArguments, this);

      return component;
    }

    return null;
  }
}

RouterComponent.__PathNode = PathNode;  // TODO: use static class fields for this
