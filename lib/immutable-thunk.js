import deepEqual from 'deep-equal';

// ImmutableThunk may be used with virtual-dom/vnode.
export default class ImmutableThunk {

  constructor(fn, args, equalArgs) {
    this.fn = fn;
    this.args = args;
    this.equalArgs = equalArgs || defaultEqualArgs;

    function defaultEqualArgs(first, second) {
      // TODO: should we use `==` or `===` to check equality?
      return deepEqual(first, second);
    };
  }

  render(previous) {
    if (shouldUpdate(this, previous)) {
      return this.fn.apply(null, this.args);
    } else {
      return previous.vnode;
    }

    function shouldUpdate(current, previous) {
      // TODO: check renders equality
      return ( !current || !previous /* || current.fn !== previous.fn */ ||
        !current.equalArgs(current.args, previous.args) );
    }
  }

};

ImmutableThunk.prototype.type = 'Thunk';
